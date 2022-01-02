import { Button, Form, Input, Typography } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useUserData } from '../../../hooks';
import { OrderForCreation } from '../../../models/ordering';
import styles from './CheckoutForm.module.css';
import CustomerInfoSection from './CustomerInfoSection';
import { PaymentMethodSection } from './PaymentMethodSection';
import { ShippingAddressSection } from './ShippingAddressSection';

interface CheckoutFormProps {
  totalPrice: number;
  totalPriceUnit: string;
  creating: boolean;
  onSubmit: (values: OrderForCreation) => void;
}

export default function CheckoutForm({
  totalPrice,
  totalPriceUnit,
  creating,
  onSubmit,
}: CheckoutFormProps): ReactElement {
  const { user } = useUserData();

  const [defaultValue] = useState({
    customer: { email: user?.email || '' },
    notes: '',
  });

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onSubmit}
      initialValues={defaultValue}
    >
      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 },
        }}
      >
        <Typography.Title style={{ margin: 0 }}>Shipping info</Typography.Title>
      </Form.Item>

      <CustomerInfoSection />

      <ShippingAddressSection />

      <Form.Item label="Notes" name="notes">
        <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
      </Form.Item>

      <PaymentMethodSection
        totalPrice={totalPrice}
        totalPriceUnit={totalPriceUnit}
      />

      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 },
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          loading={creating}
          className={styles.btn}
          block
          size="large"
        >
          Checkout
        </Button>
      </Form.Item>
    </Form>
  );
}
