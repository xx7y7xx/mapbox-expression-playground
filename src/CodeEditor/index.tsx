import React, { useState } from 'react';
import Expression from '../Expression';
import { Col, Row } from 'antd';

const defaultFeature = `{
  "type": "Feature",
  "properties": {
    "foo": "bar",
    "foo2": "bar3"
  },
  "geometry": {
    "coordinates": [
      103.807773,
      1.320402
    ],
    "type": "Point"
  }
}`;

const defaultExpression = `['concat',
  ['get', 'foo'],
  ['get', 'foo2'],
  ['string', '123']
]`;

export default function CodeEditor() {
  const [feature, setFeature] = useState(localStorage.getItem('mep_code_editor_feature') || defaultFeature);
  const [expression, setExpression] = useState(localStorage.getItem('mep_code_editor_expression') || defaultExpression);
  const [result, setResult] = useState('');
  const handleRun = () => {
    // eslint-disable-next-line no-eval
    const result = Expression.parse(eval(expression)).evaluate(JSON.parse(feature));
    setResult(result);
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
            value={feature}
            onChange={(evt) => {
              setFeature(evt.target.value);
              localStorage.setItem('mep_geojson', evt.target.value);
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
              localStorage.setItem('mep_code', evt.target.value);
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
            value={result}
          ></textarea>
        </Col>
      </Row>
    </div>
  );
}
