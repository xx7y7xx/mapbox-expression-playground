import InputNumberControl from '../InputNumberControl';
import ExpressionControl from '../ExpressionControl';

const exprConfig = [
  {
    expr: 'at',
    inputs: [
      { type: 'number', inputKey: 'inputKey', control: { comp: InputNumberControl, key: 'controlKeyGet' } },
      { type: 'array', inputKey: 'arrayInputKey' },
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
];

export default exprConfig;
