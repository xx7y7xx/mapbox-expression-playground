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
  expr: string;
  inputs: InputType[];
  outputs: OutputType[];
  expectResult?: string;
};

const exprConfigs: ExprCfgType[] = [
  {
    expr: 'at', // https://github.com/mapbox/mapbox-gl-js/blob/main/src/style-spec/expression/definitions/at.js
    inputs: [
      { inputType: 'number', inputKey: 'index', control: { comp: InputNumberControl, ctrlKey: 'index', exampleValue: 0 } },
      { inputType: 'array', inputKey: 'input' },
    ],
    outputs: [{ outputType: 'ItemType', outputKey: 'outputKey' }],
  },
  {
    expr: 'get',
    inputs: [
      {
        inputType: 'string',
        inputKey: 'inputKey',
        control: { comp: ExpressionControl, ctrlKey: 'controlKeyGet', exampleValue: 'foo' },
      },
    ],
    outputs: [{ outputType: 'value', outputKey: 'outputKey' }],
    expectResult: 'bar\nbar2',
  },
  {
    expr: 'has',
    inputs: [
      {
        inputType: 'string',
        inputKey: 'propertyFieldName',
        control: { comp: ExpressionControl, ctrlKey: 'propertyFieldName', exampleValue: 'foo' },
      },
    ],
    outputs: [{ outputType: 'boolean', outputKey: 'has' }],
  },
  {
    expr: 'in',
    inputs: [
      { inputType: 'string', inputKey: 'keyword', control: { comp: ExpressionControl, ctrlKey: 'keyword', exampleValue: 'foo' } },
      {
        inputType: ['array', 'string'],
        inputKey: 'input',
        control: { comp: ExpressionControl, ctrlKey: 'input', exampleValue: 'foobar' },
      },
    ],
    outputs: [{ outputType: 'boolean', outputKey: 'result' }],
  },
  {
    expr: 'index-of',
    inputs: [
      { inputType: 'string', inputKey: 'keyword', control: { comp: ExpressionControl, ctrlKey: 'keyword', exampleValue: 'bar' } },
      {
        inputType: ['array', 'string'],
        inputKey: 'input',
        control: { comp: ExpressionControl, ctrlKey: 'input', exampleValue: 'foobar' },
      },
    ],
    outputs: [{ outputType: 'number', outputKey: 'result' }],
  },
  {
    expr: 'length',
    inputs: [
      {
        inputType: 'string',
        inputKey: 'input',
        control: { comp: ExpressionControl, ctrlKey: 'controlKeyInput', exampleValue: 'foo' },
      },
    ],
    outputs: [{ outputType: 'number', outputKey: 'outputKey' }],
  },
  {
    expr: 'slice',
    inputs: [
      {
        inputType: 'string',
        inputKey: 'input',
        control: { comp: ExpressionControl, ctrlKey: 'input', exampleValue: 'foo' },
      },
      { inputType: 'number', inputKey: 'index', control: { comp: InputNumberControl, ctrlKey: 'index', exampleValue: 1 } },
    ],
    outputs: [{ outputType: 'string', outputKey: 'outputKey' }],
  },
  {
    expr: 'string',
    inputs: [
      { inputType: 'value', inputKey: 'value', control: { comp: ExpressionControl, ctrlKey: 'value', exampleValue: 'foo' } },
    ],
    outputs: [{ outputType: 'string', outputKey: 'value' }],
  },
];

export default exprConfigs;
