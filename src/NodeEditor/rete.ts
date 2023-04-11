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
import GetComponent from './GetComponent';

type WindowNodeMapProp = {
  editor?: NodeEditor;
  allComponents?: any; // DEPRECATED
};

declare global {
  interface Window {
    ___nodeMap: WindowNodeMapProp;
  }
}

export async function createEditor(container: HTMLDivElement) {
  const editor = new Rete.NodeEditor(NODE_EDITOR_ID, container);
  if (!window.___nodeMap) window.___nodeMap = {};
  window.___nodeMap.editor = editor;
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, reteContextMenuOptions);

  const engine = new Rete.Engine(NODE_EDITOR_ID);

  const allComponents: any = {
    [ConcatComponent.key]: new ConcatComponent(),
    [GetComponent.key]: new GetComponent(),
    [JsonComponent.key]: new JsonComponent(),
  };
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
      // console.log('process', editor.toJSON());
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
      createEditor(container).then((value) => {
        // console.log('created');
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(
    () => () => {
      if (editorRef.current) {
        console.log('destroy rete');

        (editorRef.current as NodeEditor).destroy();
      }
    },
    []
  );

  return [setContainer];
}
