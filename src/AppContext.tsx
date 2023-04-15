import { LS_KEY_CODE_EDITOR_GEOJSON } from './constants';
import { createContext, FC, ReactNode, useState } from 'react';

interface IAppContext {
  geojson: string;
  setGeojson: (geojson: string) => void;
}

const defaultFeature = `{
  "type": "Feature",
  "properties": {
    "foo": "bar",
    "foo2": "bar4"
  },
  "geometry": {
    "coordinates": [
      103.807773,
      1.320402
    ],
    "type": "Point"
  }
}`;

export const AppContext = createContext<IAppContext>({
  geojson: '',
  setGeojson: () => {},
});

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [geojson, setGeojson] = useState(() => {
    let defaultValue = defaultFeature;
    if (localStorage.getItem(LS_KEY_CODE_EDITOR_GEOJSON)) {
      defaultValue = localStorage.getItem(LS_KEY_CODE_EDITOR_GEOJSON)!;
    }
    window.___nodeMap.geojson = defaultValue;
    return defaultValue;
  });

  const appContext: IAppContext = {
    geojson,
    setGeojson: (val) => {
      setGeojson(val);
      localStorage.setItem(LS_KEY_CODE_EDITOR_GEOJSON, val);
      window.___nodeMap.geojson = val;
    },
  };

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppProvider;
