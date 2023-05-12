import InputNumberControl from '../InputNumberControl';
import ExpressionControl from '../ExpressionControl';

// TODO what is "value"
export type InputTypeTypeType = 'string' | 'array' | 'number' | 'value';

export type InputTypeType = InputTypeTypeType | InputTypeTypeType[];

export type InputType = {
  inputType: InputTypeType;
  inputKey: string;
  control?: {
    comp: typeof InputNumberControl | typeof ExpressionControl;
    ctrlKey: string;
    exampleValue: number | string;
  };
};

export type OutputType = {
  outputType: string;
  outputKey: string;
};

export type ExprCfgType = {
  inputs: InputType[];
  outputs: OutputType[];
  expectResult?: string;
};

export type ExprName = string;
