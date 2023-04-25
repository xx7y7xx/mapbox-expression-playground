import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import InputNumberControl from './InputNumberControl';
import ExpressionControl from './ExpressionControl';

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

    const ins: any[] = [];
    const addIn = (i: InputType, iv: unknown) => {
      if (i.type === 'string') {
        ins.push(`'${iv}'`);
      } else {
        ins.push(iv);
      }
    };

    this.inputs.forEach((i) => {
      if (inputs[i.inputKey].length) {
        addIn(i, inputs[i.inputKey][0]);
      } else if (i.control) {
        addIn(i, node.data[i.control?.key]);
      } else {
        // no input connection, no control, then output a invalid value
        outputs[outputKey] = null;
        return;
      }
    });

    outputs[outputKey] = `['${this.expr}', ${ins.join(', ')}]`;
  }
}
