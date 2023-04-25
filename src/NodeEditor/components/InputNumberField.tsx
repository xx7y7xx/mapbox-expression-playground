import React from 'react';
import { Col, InputNumber, Row } from 'antd';

export default function InputNumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const handleChange = (value: number | null) => {
    onChange(value);
  };
  if (!label) {
    return <InputNumber value={value} onChange={handleChange} />;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>
        {label}
      </Col>
      <Col span={12}>
        <InputNumber value={value} onChange={handleChange} />
      </Col>
    </Row>
  );
}
