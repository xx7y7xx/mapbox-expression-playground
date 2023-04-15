import React from 'react';

import { useRete } from './rete';
import NodeEditorProvider from './NodeEditorContext';
import Result from './Result';

export default function NodeEditor() {
  const [setContainer] = useRete();

  return (
    <NodeEditorProvider>
      <div className='mep-node-editor'>
        <div className='mep-node-editor-retejs-wrapper'>
          <div className='mep-node-editor-container' ref={(ref) => ref && setContainer(ref)} />
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '20%', height: '50vh' }}>
          <Result />
        </div>
      </div>
    </NodeEditorProvider>
  );
}
