import Rete, { Component, Node } from 'rete';

import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import ExpressionControl from './ExpressionControl';
import Expression from './Expression';

const KEY = 'Get';
const INPUT_KEY = 'json';
const OUTPUT_KEY = 'json';
const CONTROL_KEY_GET = 'get';

export default class GetComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;
  static inputKey = INPUT_KEY;
  static outputKey = OUTPUT_KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    node
      .addInput(new Rete.Input(INPUT_KEY, 'JSON', objectSocket))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket))
      .addControl(new ExpressionControl(this.editor, CONTROL_KEY_GET, node, { label: 'get' }));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const propertyFieldName = node.data[CONTROL_KEY_GET];

    let out = '';
    if (localStorage.getItem('code')) {
      out = `['get', '${propertyFieldName}']`;
    } else {
      const geojsonObj = inputs[INPUT_KEY][0] as GeoJSON.FeatureCollection | GeoJSON.Feature;

      if (geojsonObj.type === 'FeatureCollection') {
        geojsonObj.features.forEach((f) => {
          const result = Expression.parse(['get', propertyFieldName]).evaluate(f);
          out = result;
        });
      } else {
        const result = Expression.parse(['get', propertyFieldName]).evaluate(geojsonObj);
        out = result;
      }
    }

    console.log('xxxx2', out);

    outputs.json = out;
  }
}
