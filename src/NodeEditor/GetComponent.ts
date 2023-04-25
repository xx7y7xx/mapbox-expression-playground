import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import ExpressionControl from './ExpressionControl';

const KEY = 'Get';
const INPUT_KEY = 'inputKey';
const OUTPUT_KEY = 'outputKey';
const CONTROL_KEY_GET = 'controlKeyGet';

type InputType = {
  type: string;
  inputKey: string;
  control?: {
    comp: typeof ExpressionControl;
    key: string;
  };
};
type OutputType = {
  type: string;
  outputKey: string;
};

export default class GetComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;
  static inputKey = INPUT_KEY;
  static outputKey = OUTPUT_KEY;

  expr: string = 'get';
  inputs: InputType[] = [];
  outputs: OutputType[] = [];

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    this.inputs = [{ type: 'string', inputKey: INPUT_KEY, control: { comp: ExpressionControl, key: CONTROL_KEY_GET } }];
    this.outputs = [{ type: 'value', outputKey: OUTPUT_KEY }];

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
        outputs[OUTPUT_KEY] = null;
        return;
      }
    });

    outputs[OUTPUT_KEY] = `['${this.expr}', ${ins.join(', ')}]`;
  }
}
