import { Form, Radio, RadioChangeEvent } from 'antd';
import React, { ReactElement, useState } from 'react';
import { StripeMethod } from './StripeMethod';

export interface PaymentMethodSectionProps {
  totalPrice: number;
  totalPriceUnit: string;
}

export function PaymentMethodSection({
  totalPrice,
  totalPriceUnit,
}: PaymentMethodSectionProps): ReactElement {
  const [method, setMethod] = useState('cod');

  const onMethodChange = (e: RadioChangeEvent) => {
    setMethod(e.target.value);
  };

  return (
    <>
      <Form.Item label="Payment method" name={['payment', 'type']}>
        <Radio.Group onChange={onMethodChange} value={method}>
          <Radio value="cod">COD</Radio>
          <Radio value="stripe">Stripe</Radio>
        </Radio.Group>
      </Form.Item>

      {method === 'stripe' && (
        <StripeMethod
          totalPrice={totalPrice}
          totalPriceUnit={totalPriceUnit}
          type={method}
        />
      )}
    </>
  );
}
