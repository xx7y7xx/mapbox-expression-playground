import { NodeEditor } from 'rete';
import ResultComponent from './ResultComponent';
import componentMap from './expressions/exprComponentMap';
import { ExprCfgType } from './expressions/types';
import exprConfigMap from './expressions/exprConfigMap';

const delay = (millis: number = 2000): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), millis);
  });

/**
 * How to run examples:
 * ```
 * window.___mapboxExpressionPlayground.examples.at();
 * window.___mapboxExpressionPlayground.runExamples();
 * ```
 */
const createExamples = (editor: NodeEditor) => {
  window.___mapboxExpressionPlayground.examples = {};
  window.___mapboxExpressionPlayground.runExamples = async () => {
    console.debug('Run example start');
    for (const exprName in window.___mapboxExpressionPlayground.examples) {
      await window.___mapboxExpressionPlayground.examples[exprName]();
    }
    console.debug('Run example end');
  };

  const createInputNode = async (exprName: string, exprConfig: ExprCfgType) => {
    const nodeOpts: any = {};
    for (const input of exprConfig.inputs || []) {
      if (input.control) {
        nodeOpts[input.control.ctrlKey] = input.control.exampleValue;
      }
    }
    return window.___mapboxExpressionPlayground.allComponents[exprName].createNode(nodeOpts);
  };

  Object.keys(componentMap).forEach((exprName) => {
    // allComponents[exprName] = new componentMap[exprName]();
    window.___mapboxExpressionPlayground.examples[exprName] = async () => {
      editor.clear();

      const exprConfig = exprConfigMap[exprName];

      const inputNode = await createInputNode(exprName, exprConfig);

      inputNode.position = [0, 0];
      editor.addNode(inputNode);

      const resultNode = await window.___mapboxExpressionPlayground.allComponents['Result'].createNode();
      resultNode.position = [300, 0];
      editor.addNode(resultNode);

      editor.connect(inputNode.outputs.get(exprConfig.outputs[0].outputKey), resultNode.inputs.get(ResultComponent.inputKey));

      if (exprConfig.expectResult) {
        await delay();

        const actualResult = document.querySelector('.mep-expression-result-textarea')?.textContent;
        console.assert(actualResult === exprConfig.expectResult, '%o', { actualResult, exprName });
      }

      await delay();
    };
  });

  /**
   * Replace default examples
   */

  window.___mapboxExpressionPlayground.examples['at'] = async () => {
    editor.clear();

    const exprConfig = exprConfigMap['at'];
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
    editor.connect(getNode.outputs.get('outputKey'), atNode.inputs.get(exprConfig.inputs[1].inputKey));
    editor.connect(atNode.outputs.get('outputKey'), resultNode.inputs.get(ResultComponent.inputKey));

    await delay();
  };
};

export default createExamples;
