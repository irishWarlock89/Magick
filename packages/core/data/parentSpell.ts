import { Spell } from '../types'
export default {
  id: '801b7a36-9468-402a-8ecd-aed4038dfcd5',
  name: 'whole amethyst',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          dataControls: { name: { expanded: true } },
          playtestToggle: { receivePlaytest: true },
          success: false,
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [
              {
                node: 238,
                input: '20c0d2db-1916-433f-88c6-69d3ae123217',
                data: { pins: [] },
              },
            ],
          },
        },
        position: [-1555.4724883179474, -132.7648214211178],
        name: 'Module Trigger In',
      },
      '232': {
        id: 232,
        data: {
          name: 'Input',
          text: 'test',
          outputs: [],
          socketKey: '9d61118c-3c5a-4379-9dae-41965e56207f',
          dataControls: {
            name: { expanded: true },
            playtestToggle: { expanded: true },
            useDefault: { expanded: true },
          },
          defaultValue: 'Input text here',
          playtestToggle: { receivePlaytest: true },
          display: 'test',
          success: false,
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 238,
                input: '9d61118c-3c5a-4379-9dae-41965e56207f',
                data: { pins: [] },
              },
            ],
          },
        },
        position: [-1554.5293524397525, -362.87500885530955],
        name: 'Universal Input',
      },
      '233': {
        id: 233,
        data: {
          name: 'output-233',
          socketKey: '79aca82e-995f-451c-aa3b-8abe81e30cdb',
          display: 'test',
          success: false,
        },
        inputs: {
          input: {
            connections: [
              {
                node: 238,
                output: '940dc29f-91be-4d23-88a6-2b91d41aef15',
                data: { pins: [] },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 238,
                output: '02de01cf-48c8-4a90-b9ac-997fb3ce9cf5',
                data: { pins: [] },
              },
            ],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-758.8511439563598, -344.4560872405752],
        name: 'Output',
      },
      '238': {
        id: 238,
        data: {
          name: 'expected amethyst',
          spell: 'expected amethyst',
          inputs: [
            {
              name: 'Input',
              taskType: 'output',
              socketKey: '9d61118c-3c5a-4379-9dae-41965e56207f',
              socketType: 'anySocket',
              useSocketName: true,
              connectionType: 'input',
            },
            {
              name: 'default',
              taskType: 'option',
              socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
              socketType: 'triggerSocket',
              useSocketName: true,
              connectionType: 'input',
            },
          ],
          outputs: [
            {
              name: 'output-233',
              taskType: 'output',
              socketKey: '940dc29f-91be-4d23-88a6-2b91d41aef15',
              socketType: 'anySocket',
              useSocketName: true,
              connectionType: 'output',
            },
            {
              name: 'trigger-out-247',
              taskType: 'option',
              socketKey: '02de01cf-48c8-4a90-b9ac-997fb3ce9cf5',
              socketType: 'triggerSocket',
              useSocketName: true,
              connectionType: 'output',
            },
          ],
          spellId: 'expected amethyst',
          dataControls: { spell: { expanded: true } },
          display: '{"output-233":"test"}',
          success: false,
        },
        inputs: {
          '9d61118c-3c5a-4379-9dae-41965e56207f': {
            connections: [{ node: 232, output: 'output', data: { pins: [] } }],
          },
          '20c0d2db-1916-433f-88c6-69d3ae123217': {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: {
          '940dc29f-91be-4d23-88a6-2b91d41aef15': {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
          '02de01cf-48c8-4a90-b9ac-997fb3ce9cf5': {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1138.9208374023438, -368.720703125],
        name: 'Spell',
      },
    },
  },
  createdAt: '2022-06-10T06:48:49.841Z',
  updatedAt: '2022-06-07T23:26:14.112Z',
  deletedAt: null,
  userId: '29476106',
  modules: [],
  gameState: null,
} as unknown as Spell
