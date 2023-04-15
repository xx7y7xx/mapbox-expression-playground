import { createContext, FC, ReactNode, useState } from 'react';

interface INodeEditorContext {
  result: string;
  setResult: (result: string) => void;
}

export const NodeEditorContext = createContext<INodeEditorContext>({
  result: '',
  setResult: () => {},
});

const NodeEditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState('');

  const nodeEditorContext: INodeEditorContext = { result, setResult };

  return <NodeEditorContext.Provider value={nodeEditorContext}>{children}</NodeEditorContext.Provider>;
};

export default NodeEditorProvider;
