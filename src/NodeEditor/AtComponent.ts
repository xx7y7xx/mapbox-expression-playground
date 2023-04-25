import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import InputNumberControl from './InputNumberControl';

const KEY = 'At';
const INPUT_KEY = 'inputKey';
const ARRAY_INPUT_KEY = 'arrayInputKey';
const OUTPUT_KEY = 'outputKey';
const CONTROL_KEY_GET = 'controlKeyGet';

export default class AtComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;
  static inputKey = INPUT_KEY;
  static outputKey = OUTPUT_KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    const input = new Rete.Input(INPUT_KEY, 'number', objectSocket);
    input.addControl(new InputNumberControl(this.editor, CONTROL_KEY_GET, node));

    const arrayInput = new Rete.Input(ARRAY_INPUT_KEY, 'array', objectSocket);

    node.addInput(input).addInput(arrayInput).addOutput(new Rete.Output(OUTPUT_KEY, 'ItemType', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const indexNumber = inputs[INPUT_KEY].length ? inputs[INPUT_KEY][0] : node.data[CONTROL_KEY_GET];
    const array = inputs[ARRAY_INPUT_KEY][0];
    outputs[OUTPUT_KEY] = `['at', ${indexNumber},  ${array}]`;
  }
}
