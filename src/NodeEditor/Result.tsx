import React, { useContext, useEffect } from 'react';

import { NodeEditorContext } from './NodeEditorContext';
import { EVT_SET_RESULT } from '../constants';

const Result: React.FC = () => {
  const { result, setResult } = useContext(NodeEditorContext);

  useEffect(() => {
    const unsubscribe = window.___nodeMap.emitter.on(EVT_SET_RESULT, (arg1: string) => {
      console.debug('emitter on event', arg1);
      setResult(arg1);
    });

    return () => {
      unsubscribe();
    };
  });

  return <textarea style={{ width: '90%', height: '100%' }} value={result || ''} readOnly />;
};

export default Result;
