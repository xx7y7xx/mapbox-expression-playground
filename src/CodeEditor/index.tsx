import React, { useContext, useState } from 'react';
import { Col, Row, Tooltip } from 'antd';
import { AppContext } from '../AppContext';
import Expression from '../Expression';
import { LS_KEY_CODE_EDITOR_EXPRESSION } from '../constants';
import { QuestionCircleOutlined } from '@ant-design/icons';

const defaultExpression = `['concat',
  ['get', 'foo'],
  ['get', 'foo2'],
  ['string', '123']
]`;

export default function CodeEditor() {
  const { geojson, setGeojson } = useContext(AppContext);
  const [expression, setExpression] = useState(localStorage.getItem(LS_KEY_CODE_EDITOR_EXPRESSION) || defaultExpression);
  const [result, setResult] = useState('');
  const [geojsonError, setGeojsonError] = useState<string | null>(null);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRun = () => {
    let geojsonObj = null;
    try {
      geojsonObj = JSON.parse(geojson);
      setGeojsonError(null);
    } catch (err) {
      console.debug('[ERROR] Failed to parse JSON', err);
      setGeojsonError('[ERROR] Failed to parse JSON: ' + (err as Error).message);
    }

    let expr = null;
    try {
      // eslint-disable-next-line no-eval
      expr = eval(expression);
      setExpressionError(null);
    } catch (err) {
      console.debug('[ERROR] Failed to eval expression', err);
      setExpressionError('[ERROR] Failed to eval expression: ' + (err as Error).message);
    }

    if (!geojsonObj) {
      return;
    }
    if (expr === null) {
      return;
    }

    console.debug('CodeEditor Expression.parse', expr);
    console.debug('CodeEditor Expression.evaluate', geojsonObj);
    try {
      const result = Expression.parse(expr).evaluate(geojsonObj);
      setResult(String(result));
      setRunError(null);
    } catch (err) {
      console.debug('[ERROR] Failed to evaluate expression', err);
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
              localStorage.setItem(LS_KEY_CODE_EDITOR_EXPRESSION, evt.target.value);
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
