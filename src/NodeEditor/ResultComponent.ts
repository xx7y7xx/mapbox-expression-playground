import Rete, { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

import { objectSocket } from './JsonComponent';
import Expression from '../Expression';
import { EVT_SET_RESULT } from '../constants';

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

    node.addInput(new Rete.Input(INPUT_KEY, 'JSON', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.debug('Result:', inputs[INPUT_KEY][0]);

    if (!inputs[INPUT_KEY][0]) {
      console.debug('no input');
      return;
    }

    const { geojson } = window.___nodeMap;

    if (!geojson) {
      console.debug('geojson is invalid');
      return;
    }

    // eslint-disable-next-line no-eval
    const expr = eval(inputs[INPUT_KEY][0] as string);
    const geojsonObj = JSON.parse(geojson);

    console.debug('ResultComponent Expression.parse', expr);
    console.debug('ResultComponent Expression.evaluate', geojsonObj);
    const result = Expression.parse(expr).evaluate(geojsonObj);

    window.___nodeMap.emitter.emit(EVT_SET_RESULT, result);

    console.debug('result', result);
  }
}
