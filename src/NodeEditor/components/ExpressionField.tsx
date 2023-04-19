import React, { ChangeEvent } from 'react';
import { Col, Input, Row } from 'antd';

export default function ExpressionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target?.value);
  };
  if (!label) {
    return <Input value={value} onChange={handleChange} />;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>
        {label}
      </Col>
      <Col span={12}>
        <Input value={value} onChange={handleChange} />
      </Col>
    </Row>
  );
}
