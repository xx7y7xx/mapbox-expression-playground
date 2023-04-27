/* eslint-disable no-underscore-dangle */

import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Rete, { NodeEditor } from 'rete';
// @ts-ignore: no declaration file for module
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore: no declaration file for module
import AreaPlugin from 'rete-area-plugin';
// @ts-ignore: no declaration file for module
import ContextMenuPlugin from 'rete-context-menu-plugin';

import { LS_KEY_NODE_EDITOR_DATA, NODE_EDITOR_ID } from '../constants';
import ConcatComponent from './ConcatComponent';
import { loadConfig, reteContextMenuOptions } from './helpers';
import JsonComponent from './JsonComponent';
import ResultComponent from './ResultComponent';
import componentMap from './expressions/componentMap';

export async function createEditor(container: HTMLDivElement) {
  const editor = new Rete.NodeEditor(NODE_EDITOR_ID, container);
  window.___nodeMap.editor = editor;
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, reteContextMenuOptions);

  const engine = new Rete.Engine(NODE_EDITOR_ID);

  const allComponents: any = {
    [ConcatComponent.key]: new ConcatComponent(),
    [JsonComponent.key]: new JsonComponent(),
    [ResultComponent.key]: new ResultComponent(),
  };
  Object.keys(componentMap).forEach((key) => {
    allComponents[key] = new componentMap[key]();
  });
  window.___nodeMap.allComponents = allComponents;
  Object.keys(allComponents).forEach((key) => {
    editor.register(allComponents[key]);
    engine.register(allComponents[key]);
    console.debug('createEditor components', editor.components);
  });

  await loadConfig(editor);

  editor.on(
    // @ts-ignore
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      // console.debug('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.on(
    // @ts-ignore
    'process nodecreated nodedraged noderemoved connectioncreated connectionremoved',
    async () => {
      const data = JSON.stringify(editor.toJSON());
      console.debug('Save data to local:', editor.toJSON());
      localStorage.setItem(LS_KEY_NODE_EDITOR_DATA, data);
    }
  );

  editor.on('noderemoved', async (node /* Node */) => {
    console.debug('noderemoved', node, node.id);
  });

  editor.view.resize();
  editor.trigger('process');

  // wait then zoom, prevent node with/height is 0 when calc bbox
  // AreaPlugin.zoomAt(editor, editor.nodes);
  setTimeout(() => {
    AreaPlugin.zoomAt(editor, editor.nodes);
  }, 500);

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const editorRef = useRef<NodeEditor>();

  useEffect(() => {
    if (container) {
      createEditor(container).then((editor) => {
        console.debug('created', editor);
        editorRef.current = editor;

        editor.on('process', () => {
          console.debug(
            'process',
            editor,
            editor.nodes.find((n) => n.name === 'Concat')
          );
        });
      });
    }
  }, [container]);

  useEffect(
    () => () => {
      if (editorRef.current) {
        console.debug('destroy rete');

        (editorRef.current as NodeEditor).destroy();
      }
    },
    []
  );

  return [setContainer];
}
