import { createContext, FC, ReactNode, useState } from 'react';
import { Feature, FeatureCollection } from 'geojson';

import { LS_KEY_CODE_EDITOR_GEOJSON } from './constants';

export type GeojsonStore = FeatureCollection | Feature | null;
interface IAppContext {
  geojsonObj: GeojsonStore;
  setGeojsonObj: (geojsonObj: GeojsonStore, geojson: string) => void;
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
  geojsonObj: null,
  setGeojsonObj: () => {},
});

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [geojsonObj, setGeojsonObj] = useState(() => {
    let defaultValue = JSON.parse(defaultFeature);
    if (localStorage.getItem(LS_KEY_CODE_EDITOR_GEOJSON)) {
      defaultValue = JSON.parse(localStorage.getItem(LS_KEY_CODE_EDITOR_GEOJSON)!);
    }
    window.___nodeMap.geojsonObj = defaultValue;
    return defaultValue;
  });

  const appContext: IAppContext = {
    geojsonObj,
    setGeojsonObj: (val, valStr) => {
      setGeojsonObj(val);
      localStorage.setItem(LS_KEY_CODE_EDITOR_GEOJSON, valStr);
      window.___nodeMap.geojsonObj = val;
    },
  };

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppProvider;
