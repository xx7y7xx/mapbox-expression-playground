import InputNumberControl from './InputNumberControl';
import ExprComponent from './ExprComponent';

const KEY = 'At';

export default class AtComponent extends ExprComponent {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  expr: string = 'at';
  inputs = [
    { type: 'number', inputKey: 'inputKey', control: { comp: InputNumberControl, key: 'controlKeyGet' } },
    { type: 'array', inputKey: 'arrayInputKey' },
  ];
  outputs = [{ type: 'ItemType', outputKey: 'outputKey' }];
}
