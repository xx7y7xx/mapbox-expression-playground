import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import ExpressionControl from './ExpressionControl';

const KEY = 'Get';
const INPUT_KEY = 'inputKey';
const OUTPUT_KEY = 'outputKey';
const CONTROL_KEY_GET = 'controlKeyGet';

export default class GetComponent extends Component {
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

    const input = new Rete.Input(INPUT_KEY, 'string', objectSocket);
    input.addControl(new ExpressionControl(this.editor, CONTROL_KEY_GET, node));

    node.addInput(input).addOutput(new Rete.Output(OUTPUT_KEY, 'value', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const propertyFieldName = inputs[INPUT_KEY].length ? inputs[INPUT_KEY][0] : node.data[CONTROL_KEY_GET];
    outputs[OUTPUT_KEY] = `['get', '${propertyFieldName}']`;
  }
}
