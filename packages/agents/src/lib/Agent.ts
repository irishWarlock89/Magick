// DOCUMENTED
import * as BullMQ from 'bullmq'
import pino from 'pino'
import _ from 'lodash'
import {
  SpellManager,
  SpellRunner,
  pluginManager,
  AgentInterface,
  SpellInterface,
  getLogger,
  MagickSpellInput,
} from '@magickml/core'
import { bullMQConnection, PING_AGENT_TIME_MSEC } from '@magickml/config'
import { RedisPubSub } from '@magickml/redis-pubsub'

import { AgentManager } from './AgentManager'
import { app } from '@magickml/server-core'

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent extends RedisPubSub implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables: Record<string, string>
  data: AgentInterface
  spellManager: SpellManager
  projectId: string
  agentManager: AgentManager
  spellRunner?: SpellRunner
  logger: pino.Logger = getLogger()
  worker: BullMQ.Worker
  queue: BullMQ.Queue

  outputTypes: any[] = []
  updateInterval: any

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   * @param agentManager {AgentManager} - The instance's manager.
   */
  constructor(
    agentData: AgentInterface,
    agentManager: AgentManager,
  ) {
    super()
    this.secrets = agentData?.secrets ? JSON.parse(agentData?.secrets) : {}
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId

    this.logger.info('Creating new agent named: %s | %s', this.name, this.id)
    // Set up the agent worker to handle incoming messages
    this.worker = new BullMQ.Worker(`agent:${this.id}:run`, this.runWorker.bind(this), {
      connection: bullMQConnection,
    })
    this.queue = new BullMQ.Queue(`agent:run:result`, {
      connection: bullMQConnection,
    })

    const spellManager = new SpellManager({
      cache: false,
      agent: this,
      app,
    })

    this.spellManager = spellManager
    ;(async () => {
      if (!agentData.rootSpellId) {
        this.logger.warn('No root spell found for agent: %o', {
          id: this.id,
          name: this.name,
        })
        return
      }
      const spell = (
        await app.service('spells').find({
          query: {
            projectId: agentData.projectId,
            id: agentData.rootSpellId,
          },
        })
      ).data[0]

      this.spellRunner = await spellManager.load(spell)

      const agentStartMethods = pluginManager.getAgentStartMethods()

      for (const method of Object.keys(agentStartMethods)) {
        try {
          await agentStartMethods[method]({
            agentManager,
            agent: this,
            spellRunner: this.spellRunner,
          })
        } catch (err) {
          this.error('Error in agent start method', { method, err })
        }
      }

      const outputTypes = pluginManager.getOutputTypes()
      this.outputTypes = outputTypes

      this.updateInterval = setInterval(() => {
        // every second, update the agent, set pingedAt to now
        app.service('agents').patch(this.id, {
          pingedAt: new Date().toISOString(),
        })
      }, PING_AGENT_TIME_MSEC)
      this.logger.info('New agent created: %s | %s', this.name, this.id)
    })()
  }

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    const agentStopMethods = pluginManager.getAgentStopMethods()
    if (agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        agentStopMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
        })
      }
    this.log('destroyed agent', { id: this.id })
  }

  // returns the channel for the agent
  get channel() {
    return `agent:${this.id}`
  }

  // published an event to the agents event stream
  publishEvent(event, message) {
    this.publish(`${this.channel}:${event}`, {
      ...message,
      // make sure all events include the agent and project id
      agentId: this.id,
      projectId: this.projectId,
    })
  }

  // sends a log event along the event stream
  log(message, data) {
    this.logger.info(`${message} ${JSON.stringify(data)}`)

    this.publishEvent('log', {
      eventType: 'log',
      message,
      data,
    })
  }

  warn(message, data) {
    this.logger.warn(`${message} ${JSON.stringify(data)}`)

    this.publishEvent('log', {
      eventType: 'warn',
      message,
      data,
    })
  }

  error(message, data = {}) {
    this.logger.error(`${message} %o`, { error: data })

    this.publishEvent('log', {
      eventType: 'error',
      message,
      data: { error: data },
    })
  }

  async runWorker(job: AgentJob) {
    // the job name is the agent id.  Only run if the agent id matches.
    if (this.id !== job.data.agentId) return

    const { data } = job

    // Do we want a debug logger here?
    const output = await this.spellRunner?.runComponent({
      ...data,
      agent: this,
      secrets: this.secrets,
      publicVariables: this.publicVariables,
      runSubspell: true,
      app,
    })

    await this.queue.add('agent:run:result', {
      agentId: this.id,
      projectId: this.projectId,
      originalData: data,
      result: output,
    })
  }
}

export interface AgentJob {
  data: {
    inputs: MagickSpellInput
    agentId: string
    spellId: string
  }
}

// Exporting Agent class as default
export default Agent
