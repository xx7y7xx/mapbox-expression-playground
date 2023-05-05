import { NodeEditor } from 'rete';
import ResultComponent from './ResultComponent';
import componentMap from './expressions/componentMap';
import exprConfigs, { ExprCfgType } from './expressions/config';

const delay = (millis: number = 2000): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), millis);
  });

/**
 * How to run examples:
 * ```
 * window.___mapboxExpressionPlayground.examples.at();
 * for (const key in window.___mapboxExpressionPlayground.examples) { await window.___mapboxExpressionPlayground.examples[key](); }
 * ```
 */
const createExamples = (editor: NodeEditor) => {
  window.___mapboxExpressionPlayground.examples = {};

  const createInputNode = async (key: string, exprConfig: ExprCfgType) => {
    const nodeOpts: any = {};
    for (const input of exprConfig.inputs || []) {
      if (input.control) {
        nodeOpts[input.control.key] = input.control.exampleValue;
      }
    }
    return window.___mapboxExpressionPlayground.allComponents[key].createNode(nodeOpts);
  };

  Object.keys(componentMap).forEach((key) => {
    // allComponents[key] = new componentMap[key]();
    window.___mapboxExpressionPlayground.examples[key] = async () => {
      editor.clear();

      const exprConfig = exprConfigs.find((e) => e.expr === key);
      if (!exprConfig) {
        console.error('No config found for expression', key);
        return;
      }

      const inputNode = await createInputNode(key, exprConfig);

      inputNode.position = [0, 0];
      editor.addNode(inputNode);

      const resultNode = await window.___mapboxExpressionPlayground.allComponents['Result'].createNode();
      resultNode.position = [300, 0];
      editor.addNode(resultNode);

      editor.connect(inputNode.outputs.get(exprConfig.outputs[0].outputKey), resultNode.inputs.get(ResultComponent.inputKey));

      await delay();
    };
  });

  /**
   * Replace default examples
   */

  window.___mapboxExpressionPlayground.examples['at'] = async () => {
    editor.clear();

    const exprConfig = exprConfigs.find((e) => e.expr === 'at');
    if (!exprConfig) {
      console.error('No config found for expression', 'at');
      return;
    }

    const getNode = await window.___mapboxExpressionPlayground.allComponents['get'].createNode({ controlKeyGet: 'arr' });
    const atNode = await createInputNode('at', exprConfig);
    const resultNode = await window.___mapboxExpressionPlayground.allComponents['Result'].createNode();
    getNode.position = [0, 0];
    atNode.position = [250, 0];
    resultNode.position = [500, 0];
    editor.addNode(getNode);
    editor.addNode(atNode);
    editor.addNode(resultNode);
    editor.connect(
      getNode.outputs.get('outputKey'),
      atNode.inputs.get(exprConfigs.find((e) => e.expr === 'at')?.inputs[1].inputKey)
    );
    editor.connect(atNode.outputs.get('outputKey'), resultNode.inputs.get(ResultComponent.inputKey));

    await delay();
  };
};

export default createExamples;
