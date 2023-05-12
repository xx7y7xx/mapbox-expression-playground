import React, { useContext, useState } from 'react';
import { Col, Row, Tooltip, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { AppContext } from '../AppContext';
import { LS_KEY_CODE_EDITOR_EXPRESSION, LS_KEY_CODE_EDITOR_GEOJSON } from '../constants';
import { runExpression } from './helpers';

const defaultExpression = `['concat',
  ['get', 'foo'],
  ['get', 'foo2'],
  ['string', '123']
]`;

const defaultGeojson = `{
  "type": "Feature",
  "properties": {
    "foo": "bar",
    "foo2": "bar2"
  },
  "geometry": {
    "coordinates": [
      103.807773,
      1.320402
    ],
    "type": "Point"
  }
}`;

export default function CodeEditor() {
  const { geojsonObj, setGeojsonObj } = useContext(AppContext);
  const [geojson, setGeojson] = useState(localStorage.getItem(LS_KEY_CODE_EDITOR_GEOJSON) || defaultGeojson);
  const [expression, setExpression] = useState(localStorage.getItem(LS_KEY_CODE_EDITOR_EXPRESSION) || defaultExpression);
  const [expressionObj, setExpressionObj] = useState(() => {
    // eslint-disable-next-line no-eval
    return eval(localStorage.getItem(LS_KEY_CODE_EDITOR_EXPRESSION) || defaultExpression);
  });
  const [result, setResult] = useState('');
  const [geojsonError, setGeojsonError] = useState<string | null>(null);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRun = () => {
    if (!geojsonObj) {
      message.error('Failed to get GeoJSON before running expression!');
      return;
    }

    if (!expressionObj) {
      message.error('Failed to get Expression before running expression!');
      return;
    }

    setRunError(null);
    try {
      setResult(runExpression(expressionObj, geojsonObj));
    } catch (err) {
      setRunError('[ERROR] Failed to evaluate expression: ' + (err as Error).message);
    }
  };

  const handleKeyDownToRun = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  };

  return (
    <div className='mep-code-editor'>
      <Row>
        <Col span={10}>
          <b>Feature</b>:
        </Col>
        <Col span={10}>
          <b>Expression</b>:{' '}
          <Tooltip title='Press "Cmd+R" to evaluate this expression'>
            <QuestionCircleOutlined />
          </Tooltip>
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

              setGeojsonError(null);
              try {
                const geojsonObj = JSON.parse(evt.target.value);
                setGeojsonObj(geojsonObj, evt.target.value);
              } catch (err) {
                // console.debug('[ERROR] Failed to parse JSON', err);
                setGeojsonError('[ERROR] Failed to parse JSON: ' + (err as Error).message);
              }
            }}
            onKeyDown={handleKeyDownToRun}
          ></textarea>
          <br />
          {geojsonError && <span style={{ color: 'red' }}>{geojsonError}</span>}
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

              setExpressionError(null);
              try {
                // eslint-disable-next-line no-eval
                const exprObj = eval(evt.target.value);

                setExpressionObj(exprObj);
                localStorage.setItem(LS_KEY_CODE_EDITOR_EXPRESSION, JSON.stringify(exprObj));
              } catch (err) {
                console.debug('[ERROR] Failed to eval expression', err);
                setExpressionError('[ERROR] Failed to eval expression: ' + (err as Error).message);
              }
            }}
            onKeyDown={handleKeyDownToRun}
          ></textarea>
          <br />
          {expressionError && <span style={{ color: 'red' }}>{expressionError}</span>}
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
              height: '250px',
            }}
            readOnly
            value={result || ''}
          ></textarea>
          <br />
          {runError && <span style={{ color: 'red' }}>{runError}</span>}
        </Col>
      </Row>
    </div>
  );
}
