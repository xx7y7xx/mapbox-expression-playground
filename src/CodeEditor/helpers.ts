import { Expression as MapboxExpression } from 'mapbox-gl';
import { Feature, FeatureCollection } from 'geojson';

import Expression from '../Expression';

export const runExpression = (expressionObj: MapboxExpression, geojsonObj: FeatureCollection | Feature): string => {
  const results: string[] = [];

  const fc =
    geojsonObj.type === 'FeatureCollection'
      ? geojsonObj
      : {
          type: 'FeatureCollection',
          features: [geojsonObj],
        };

  fc.features.forEach((f) => {
    console.debug('runExpression Expression.parse', expressionObj);
    console.debug('runExpression Expression.evaluate', f);
    const result = Expression.parse(expressionObj).evaluate(f);
    console.debug('runExpression Expression.evaluate => result', result);
    results.push(String(result));
  });

  return results.join('\n');
};
