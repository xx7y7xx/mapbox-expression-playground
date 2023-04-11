import React from 'react';
import { Tabs, TabsProps } from 'antd';

import NodeEditor from './NodeEditor';
import CodeEditor from './CodeEditor';

import './App.css';

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
  return (
    <div className='mep-app'>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  );
}

export default App;
