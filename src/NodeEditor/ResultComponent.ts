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
    console.debug('ResultComponent inputs:', inputs);

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

    const exprStr = inputs[INPUT_KEY][0] as string;
    console.debug('ResultComponent exprStr:', exprStr);

    // eslint-disable-next-line no-eval
    const expr = eval(exprStr);

    let result: string = '';
    try {
      console.debug('ResultComponent to run expr:', expr);
      result = runExpression(expr, geojsonObj);
    } catch (err) {
      console.error('ResultComponent failed to run expression', (err as Error).message);
      message.error('Failed to run expression');
    }

    window.___nodeMap.emitter.emit(EVT_SET_RESULT, exprStr, result);

    console.debug('result', result);
  }
}
