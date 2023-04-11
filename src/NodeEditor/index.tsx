import React from 'react';

import { useRete } from './rete';

export default function NodeEditor() {
  const [setContainer] = useRete();

  return (
    <div className='mep-node-editor'>
      <div className='mep-node-editor-container' ref={(ref) => ref && setContainer(ref)} />
    </div>
  );
}
