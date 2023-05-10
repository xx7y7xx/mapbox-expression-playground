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
  type: string;
  outputKey: string;
};

export type ExprCfgType = {
  expr: string;
  inputs: InputType[];
  outputs: OutputType[];
};

const exprConfigs: ExprCfgType[] = [
  {
    expr: 'at', // https://github.com/mapbox/mapbox-gl-js/blob/main/src/style-spec/expression/definitions/at.js
    inputs: [
      { inputType: 'number', inputKey: 'index', control: { comp: InputNumberControl, ctrlKey: 'index', exampleValue: 0 } },
      { inputType: 'array', inputKey: 'input' },
    ],
    outputs: [{ type: 'ItemType', outputKey: 'outputKey' }],
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
    outputs: [{ type: 'value', outputKey: 'outputKey' }],
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
    outputs: [{ type: 'boolean', outputKey: 'has' }],
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
    outputs: [{ type: 'boolean', outputKey: 'result' }],
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
    outputs: [{ type: 'number', outputKey: 'result' }],
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
    outputs: [{ type: 'number', outputKey: 'outputKey' }],
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
    outputs: [{ type: 'string', outputKey: 'outputKey' }],
  },
  {
    expr: 'string',
    inputs: [
      { inputType: 'value', inputKey: 'value', control: { comp: ExpressionControl, ctrlKey: 'value', exampleValue: 'foo' } },
    ],
    outputs: [{ type: 'string', outputKey: 'value' }],
  },
];

export default exprConfigs;
