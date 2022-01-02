import { Form, Input, Modal } from 'antd';
import React, { ReactElement } from 'react';
import { OrderDetails } from '../../../models/ordering';

interface OrderEditModalProps {
  details: OrderDetails;
  visible: boolean;
  toggleEditModal: () => void;
  onSubmit: (values: Partial<OrderDetails>) => void;
}

export function OrderEditModal({
  details,
  visible,
  toggleEditModal,
  onSubmit,
}: OrderEditModalProps): ReactElement {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      onCancel={toggleEditModal}
      title="Edit order information"
      onOk={() => {
        onSubmit(form.getFieldsValue());
      }}
    >
      <Form form={form} initialValues={details} layout="vertical">
        <Form.Item label="Notes" name="notes">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
