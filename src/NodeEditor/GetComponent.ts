import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import ExpressionControl from './ExpressionControl';

const KEY = 'Get';
const INPUT_KEY = 'json';
const OUTPUT_KEY = 'json';
const CONTROL_KEY_GET = 'get';

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

    node
      .addInput(new Rete.Input(INPUT_KEY, 'string', objectSocket))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'value', objectSocket))
      .addControl(new ExpressionControl(this.editor, CONTROL_KEY_GET, node, { label: 'string' }));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let propertyFieldName = node.data[CONTROL_KEY_GET];
    propertyFieldName = inputs[INPUT_KEY][0];

    outputs[OUTPUT_KEY] = `['get', '${propertyFieldName}']`;
  }
}
