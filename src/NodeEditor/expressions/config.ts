import InputNumberControl from '../InputNumberControl';
import ExpressionControl from '../ExpressionControl';

export type ExprCfgType = {
  expr: string;
  inputs: {
    type: string;
    inputKey: string;
    control?: {
      comp: typeof InputNumberControl | typeof ExpressionControl;
      key: string;
      exampleValue: number | string;
    };
  }[];
  outputs: {
    type: string;
    outputKey: string;
  }[];
};

const exprConfigs: ExprCfgType[] = [
  {
    expr: 'at', // https://github.com/mapbox/mapbox-gl-js/blob/main/src/style-spec/expression/definitions/at.js
    inputs: [
      { type: 'number', inputKey: 'index', control: { comp: InputNumberControl, key: 'index', exampleValue: 0 } },
      { type: 'array', inputKey: 'input' },
    ],
    outputs: [{ type: 'ItemType', outputKey: 'outputKey' }],
  },
  {
    expr: 'get',
    inputs: [
      { type: 'string', inputKey: 'inputKey', control: { comp: ExpressionControl, key: 'controlKeyGet', exampleValue: 'foo' } },
    ],
    outputs: [{ type: 'value', outputKey: 'outputKey' }],
  },
  {
    expr: 'has',
    inputs: [
      {
        type: 'string',
        inputKey: 'propertyFieldName',
        control: { comp: ExpressionControl, key: 'propertyFieldName', exampleValue: 'foo' },
      },
    ],
    outputs: [{ type: 'boolean', outputKey: 'has' }],
  },
  {
    expr: 'string',
    inputs: [{ type: 'value', inputKey: 'value', control: { comp: ExpressionControl, key: 'value', exampleValue: 'foo' } }],
    outputs: [{ type: 'string', outputKey: 'value' }],
  },
];

export default exprConfigs;
