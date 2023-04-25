import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import InputNumberControl from './InputNumberControl';

const KEY = 'At';
const INPUT_KEY = 'inputKey';
const ARRAY_INPUT_KEY = 'arrayInputKey';
const OUTPUT_KEY = 'outputKey';
const CONTROL_KEY_GET = 'controlKeyGet';

type InputType = {
  type: string;
  inputKey: string;
  control?: {
    comp: typeof InputNumberControl;
    key: string;
  };
};
type OutputType = {
  type: string;
  outputKey: string;
};

export default class AtComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;
  static inputKey = INPUT_KEY;
  static outputKey = OUTPUT_KEY;

  expr: string = 'at';
  inputs: InputType[] = [];
  outputs: OutputType[] = [];

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    this.inputs = [
      { type: 'number', inputKey: INPUT_KEY, control: { comp: InputNumberControl, key: CONTROL_KEY_GET } },
      { type: 'array', inputKey: ARRAY_INPUT_KEY },
    ];
    this.outputs = [{ type: 'ItemType', outputKey: OUTPUT_KEY }];

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
