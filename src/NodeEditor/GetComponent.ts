import ExpressionControl from './ExpressionControl';
import ExprComponent from './ExprComponent';

const KEY = 'Get';

export default class GetComponent extends ExprComponent {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  expr: string = 'get';
  inputs = [{ type: 'string', inputKey: 'inputKey', control: { comp: ExpressionControl, key: 'controlKeyGet' } }];
  outputs = [{ type: 'value', outputKey: 'outputKey' }];
}
