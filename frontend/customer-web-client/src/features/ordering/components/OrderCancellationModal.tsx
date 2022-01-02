import { Modal, Typography } from 'antd';
import React, { ReactElement } from 'react';

interface OrderCancellationModalProps {
  visible: boolean;
  onConfirmClick: () => void;
  toggleCancellationModal: () => void;
}

export function OrderCancellationModal({
  visible,
  onConfirmClick,
  toggleCancellationModal,
}: OrderCancellationModalProps): ReactElement {
  return (
    <Modal
      visible={visible}
      title="Cancel order"
      okText="Confirm"
      onOk={onConfirmClick}
      onCancel={toggleCancellationModal}
    >
      <Typography>
        You are about to cancel this order, do you really want to perform this
        action?
      </Typography>
    </Modal>
  );
}
