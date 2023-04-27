import React, { useContext, useEffect, useState } from 'react';

import { NodeEditorContext } from './NodeEditorContext';
import { EVT_SET_RESULT } from '../constants';

const Result: React.FC = () => {
  const { result, setResult } = useContext(NodeEditorContext);
  const [exprStr, setExprStr] = useState('');

  useEffect(() => {
    const unsubscribe = window.___nodeMap.emitter.on(EVT_SET_RESULT, (arg1: string, arg2: string) => {
      setExprStr(arg1);
      setResult(arg2);
    });

    return () => {
      unsubscribe();
    };
  }, [setResult]);

  return (
    <div className='mep-expression-result' style={{ height: '100%' }}>
      Expression:
      <textarea style={{ width: '90%', height: '20%' }} value={exprStr} readOnly />
      Result:
      <textarea style={{ width: '90%', height: '80%' }} value={result || ''} readOnly />
    </div>
  );
};

export default Result;
