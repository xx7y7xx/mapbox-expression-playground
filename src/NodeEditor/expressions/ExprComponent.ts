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
      console.error('ExprComponent: editor is not defined');
      return;
    }

    this.config.inputs.forEach(({ inputKey, inputType, control }) => {
      const input = new Rete.Input(inputKey, typeToInputTitle(inputType), objectSocket);
      if (control) {
        const InputControl = control.comp;
        input.addControl(new InputControl(this.editor, control.ctrlKey, node));
      }
      node.addInput(input);
    });

    this.config.outputs.forEach((o) => {
      const output = new Rete.Output(o.outputKey, o.outputType, objectSocket);
      node.addOutput(output);
    });
  }

  worker(node: NodeData, dataInputs: WorkerInputs, dataOutputs: WorkerOutputs) {
    const { outputKey } = this.config.outputs[0];

    const args: any[] = [];

    this.config.inputs.forEach(({ inputKey, inputType, control }) => {
      if (dataInputs[inputKey].length) {
        // this node has input connection, use expr from input node
        args.push(dataInputs[inputKey][0]);
      } else if (control) {
        // this node has no input connection, use control(e.g. input box) value
        const controlVal = node.data[control?.ctrlKey];
        args.push(inputType === 'number' ? controlVal : `'${controlVal}'`);
      } else {
        // no input connection, no control, then output a invalid value
        // TODO deal with no connection case
        dataOutputs[outputKey] = null;
        return;
      }
    });

    const out = `['${this.expr}', ${args.join(', ')}]`;
    console.debug('ExprComponent out:', out);
    dataOutputs[outputKey] = out;
  }
}
