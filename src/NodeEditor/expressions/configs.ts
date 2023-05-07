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
    key: string;
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
      { inputType: 'number', inputKey: 'index', control: { comp: InputNumberControl, key: 'index', exampleValue: 0 } },
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
        control: { comp: ExpressionControl, key: 'controlKeyGet', exampleValue: 'foo' },
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
        control: { comp: ExpressionControl, key: 'propertyFieldName', exampleValue: 'foo' },
      },
    ],
    outputs: [{ type: 'boolean', outputKey: 'has' }],
  },
  {
    expr: 'in',
    inputs: [
      { inputType: 'string', inputKey: 'keyword', control: { comp: ExpressionControl, key: 'keyword', exampleValue: 'foo' } },
      {
        inputType: ['array', 'string'],
        inputKey: 'input',
        control: { comp: ExpressionControl, key: 'input', exampleValue: 'foobar' },
      },
    ],
    outputs: [{ type: 'boolean', outputKey: 'result' }],
  },
  {
    expr: 'string',
    inputs: [{ inputType: 'value', inputKey: 'value', control: { comp: ExpressionControl, key: 'value', exampleValue: 'foo' } }],
    outputs: [{ type: 'string', outputKey: 'value' }],
  },
];

export default exprConfigs;
