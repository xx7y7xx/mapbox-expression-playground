import Rete, { Component, Node } from 'rete';

import { objectSocket } from '../JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

import { InputType, InputTypeType, OutputType } from './configs';

const typeToInputTitle = (inputType: InputTypeType) => {
  if (typeof inputType === 'object') {
    return inputType.join(' | ');
  }
  return inputType;
};

export default abstract class ExprComponent extends Component {
  abstract expr: string;
  abstract config: {
    inputs: InputType[];
    outputs: OutputType[];
  };

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    this.config.inputs.forEach((i) => {
      const input = new Rete.Input(i.inputKey, typeToInputTitle(i.inputType), objectSocket);
      if (i.control) {
        const InputControl = i.control.comp;
        input.addControl(new InputControl(this.editor, i.control.ctrlKey, node));
      }
      node.addInput(input);
    });

    this.config.outputs.forEach((o) => {
      const output = new Rete.Output(o.outputKey, o.outputType, objectSocket);
      node.addOutput(output);
    });
  }

  worker(node: NodeData, dataInputs: WorkerInputs, outputs: WorkerOutputs) {
    const { outputKey } = this.config.outputs[0];

    const args: any[] = [];

    this.config.inputs.forEach((input) => {
      if (dataInputs[input.inputKey].length) {
        // this node has input connection, use expr from input node
        args.push(dataInputs[input.inputKey][0]);
      } else if (input.control) {
        // this node has no input connection, use control(e.g. input box) value
        const controlVal = node.data[input.control?.ctrlKey];
        args.push(input.inputType === 'number' ? controlVal : `'${controlVal}'`);
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
