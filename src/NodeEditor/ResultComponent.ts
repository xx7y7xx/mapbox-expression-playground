import { message } from 'antd';
import Rete, { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

import { objectSocket } from './JsonComponent';
import { EVT_SET_RESULT } from '../constants';
import { runExpression } from '../CodeEditor/helpers';

const KEY = 'Result';
const INPUT_KEY = 'json';

export default class ResultComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;
  static inputKey = INPUT_KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    node.addInput(new Rete.Input(INPUT_KEY, 'expression', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.debug('ResultComponent inputs[key][0]:', inputs[INPUT_KEY][0]);

    if (!inputs[INPUT_KEY][0]) {
      console.debug('no input');
      return;
    }

    const { geojsonObj } = window.___nodeMap;

    if (!geojsonObj) {
      console.debug('geojson is invalid', geojsonObj);
      message.error('GeoJSON is invalid, please check it in Code Editor!');
      return;
    }

    // eslint-disable-next-line no-eval
    const expr = eval(inputs[INPUT_KEY][0] as string);

    let result: string = '';
    try {
      console.debug('ResultComponent to run expr:', expr);
      result = runExpression(expr, geojsonObj);
    } catch (err) {
      console.error('ResultComponent failed to run expression', (err as Error).message);
      message.error('Failed to run expression');
    }

    window.___nodeMap.emitter.emit(EVT_SET_RESULT, result);

    console.debug('result', result);
  }
}
