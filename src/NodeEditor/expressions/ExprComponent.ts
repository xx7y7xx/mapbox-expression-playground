import Rete, { Component, Node } from 'rete';

import { objectSocket } from '../JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import InputNumberControl from '../InputNumberControl';
import ExpressionControl from '../ExpressionControl';

type InputType = {
  type: string;
  inputKey: string;
  control?: {
    comp: typeof InputNumberControl | typeof ExpressionControl;
    key: string;
  };
};
type OutputType = {
  type: string;
  outputKey: string;
};

export default abstract class ExprComponent extends Component {
  abstract expr: string;
  abstract inputs: InputType[];
  abstract outputs: OutputType[];

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    this.inputs.forEach((i) => {
      const input = new Rete.Input(i.inputKey, i.type, objectSocket);
      if (i.control) {
        const InputControl = i.control.comp;
        input.addControl(new InputControl(this.editor, i.control.key, node));
      }
      node.addInput(input);
    });

    this.outputs.forEach((o) => {
      const output = new Rete.Output(o.outputKey, o.type, objectSocket);
      node.addOutput(output);
    });
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const { outputKey } = this.outputs[0];

    const args: any[] = [];

    this.inputs.forEach((i) => {
      if (inputs[i.inputKey].length) {
        // this node has input connection, use expr from input node
        args.push(inputs[i.inputKey][0]);
      } else if (i.control) {
        // this node has no input connection, use control(e.g. input box) value
        args.push(`'${node.data[i.control?.key]}'`);
      } else {
        // no input connection, no control, then output a invalid value
        // TODO deal with no connection case
        outputs[outputKey] = null;
        return;
      }
    });

    const out = `['${this.expr}', ${args.join(', ')}]`;
    console.debug('ExprComponent out:', out);
    outputs[outputKey] = out;
  }
}
