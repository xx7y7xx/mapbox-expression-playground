import React from 'react';
import { NodeEditor as ReteNodeEditor } from 'rete';
import { Tabs, TabsProps } from 'antd';

import AppProvider, { GeojsonStore } from './AppContext';
import NodeEditor from './NodeEditor';
import CodeEditor from './CodeEditor';
import EventEmitter from './EventEmitter';

import './App.css';

type WindowNodeMapProp = {
  editor?: ReteNodeEditor;
  allComponents?: any; // DEPRECATED
  geojsonObj?: GeojsonStore;
  emitter?: any;
  examples?: any;
};

declare global {
  interface Window {
    ___mapboxExpressionPlayground: WindowNodeMapProp;
  }
}

window.___mapboxExpressionPlayground = {
  emitter: new EventEmitter(),
};

const items: TabsProps['items'] = [
  {
    key: 'code-editor',
    label: 'Code Editor',
    children: <CodeEditor />,
  },
  {
    key: 'node-editor',
    label: 'Node Editor',
    children: <NodeEditor />,
  },
];

function App() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  // @ts-ignore
  const tab = params.tab || 'code-editor';
  return (
    <AppProvider>
      <div className='mep-app'>
        <Tabs defaultActiveKey={tab} items={items} />
      </div>
    </AppProvider>
  );
}

export default App;
