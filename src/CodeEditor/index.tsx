import React, { useContext, useState } from 'react';
import { Col, Row } from 'antd';
import { AppContext } from '../AppContext';
import Expression from '../Expression';
import { LS_KEY_CODE_EDITOR_EXPRESSION } from '../constants';

const defaultExpression = `['concat',
  ['get', 'foo'],
  ['get', 'foo2'],
  ['string', '123']
]`;

export default function CodeEditor() {
  const { geojson, setGeojson } = useContext(AppContext);
  const [expression, setExpression] = useState(localStorage.getItem(LS_KEY_CODE_EDITOR_EXPRESSION) || defaultExpression);
  const [result, setResult] = useState('');

  const handleRun = () => {
    let geojsonObj = null;
    try {
      geojsonObj = JSON.parse(geojson);
    } catch (err) {
      console.debug('[ERROR] Failed to parse JSON', err);
    }

    let expr = null;
    try {
      // eslint-disable-next-line no-eval
      expr = eval(expression);
    } catch (err) {
      console.debug('[ERROR] Failed to eval expression');
    }

    if (!geojsonObj) {
      return;
    }

    console.debug('CodeEditor Expression.parse', expr);
    console.debug('CodeEditor Expression.evaluate', geojsonObj);
    const result = Expression.parse(expr).evaluate(geojsonObj);
    setResult(String(result));
  };

  return (
    <div className='mep-code-editor'>
      <Row>
        <Col span={10}>
          <b>Feature</b>:
        </Col>
        <Col span={10}>
          <b>Expression</b>:
        </Col>
        <Col span={4}></Col>
      </Row>
      <Row>
        <Col span={10}>
          <textarea
            style={{
              width: '99%',
              height: '400px',
            }}
            value={geojson}
            onChange={(evt) => {
              setGeojson(evt.target.value);
            }}
          ></textarea>
        </Col>
        <Col span={10}>
          <textarea
            style={{
              width: '99%',
              height: '400px',
            }}
            value={expression}
            onChange={(evt) => {
              setExpression(evt.target.value);
              localStorage.setItem(LS_KEY_CODE_EDITOR_EXPRESSION, evt.target.value);
            }}
            onKeyDown={(e) => {
              if (e.metaKey || e.ctrlKey) {
                switch (e.code) {
                  case 'KeyR': {
                    e.preventDefault();
                    return handleRun();
                  }
                  // default:
                  //   console.debug('no key action', e.code);
                }
              }
              return '';
            }}
          ></textarea>
        </Col>
        <Col span={4}>
          <button style={{ width: '90%', height: '40px' }} onClick={handleRun}>
            Run
          </button>
          <br />
          <br />
          <b>Result</b>:
          <textarea
            style={{
              width: '90%',
              height: '300px',
            }}
            readOnly
            value={result || ''}
          ></textarea>
        </Col>
      </Row>
    </div>
  );
}
