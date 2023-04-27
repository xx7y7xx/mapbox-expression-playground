import InputNumberControl from '../InputNumberControl';
import ExpressionControl from '../ExpressionControl';

const exprConfig = [
  {
    expr: 'at', // https://github.com/mapbox/mapbox-gl-js/blob/main/src/style-spec/expression/definitions/at.js
    inputs: [
      { type: 'number', inputKey: 'index', control: { comp: InputNumberControl, key: 'index' } },
      { type: 'array', inputKey: 'input' },
    ],
    outputs: [{ type: 'ItemType', outputKey: 'outputKey' }],
  },
  {
    expr: 'get',
    inputs: [{ type: 'string', inputKey: 'inputKey', control: { comp: ExpressionControl, key: 'controlKeyGet' } }],
    outputs: [{ type: 'value', outputKey: 'outputKey' }],
  },
  {
    expr: 'has',
    inputs: [{ type: 'string', inputKey: 'propertyFieldName', control: { comp: ExpressionControl, key: 'propertyFieldName' } }],
    outputs: [{ type: 'boolean', outputKey: 'has' }],
  },
  {
    expr: 'string',
    inputs: [{ type: 'value', inputKey: 'value', control: { comp: ExpressionControl, key: 'value' } }],
    outputs: [{ type: 'string', outputKey: 'value' }],
  },
];

export default exprConfig;
