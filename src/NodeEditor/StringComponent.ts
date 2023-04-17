import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import ExpressionControl from './ExpressionControl';

const KEY = 'String';
const OUTPUT_KEY = 'string';
const CONTROL_KEY_GET = 'value';

export default class StringComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static outputKey = OUTPUT_KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    node
      .addOutput(new Rete.Output(OUTPUT_KEY, 'string', objectSocket))
      .addControl(new ExpressionControl(this.editor, CONTROL_KEY_GET, node, { label: 'value' }));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY_GET];
  }
}
