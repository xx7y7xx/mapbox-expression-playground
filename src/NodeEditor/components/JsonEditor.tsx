import React, { ChangeEvent, useState } from 'react';
import { Button, Input, Modal } from 'antd';

export default function JsonEditor({ value = '', onChange }: { value: string; onChange: (value: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target?.value);
  };
  return (
    <div>
      <Button type='primary' onClick={showModal}>
        Open JSON Editor
      </Button>
      <Modal title='JSON Editor' width={800} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {/* <textarea
        rows={5}
        cols={40}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPointerDown={(e) => {
          // When drag slider, the node should not move
          e.stopPropagation();
        }}
      /> */}
        <Input value={value} onChange={handleChange} />
      </Modal>
    </div>
  );
}
