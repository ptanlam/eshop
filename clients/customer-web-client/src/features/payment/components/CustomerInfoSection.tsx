import styles from './CheckoutForm.module.css';
import { Form, Input } from 'antd';
import PhoneInput from 'react-phone-input-2';
import React, { ReactElement } from 'react';
import 'react-phone-input-2/lib/style.css';

export default function CustomerInfoSection(): ReactElement {
  return (
    <>
      <Form.Item
        label="Email"
        name={['customer', 'email']}
        rules={[
          {
            required: true,
            message: 'Please enter your email!',
          },
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Full name"
        name={['customer', 'fullName']}
        rules={[
          {
            required: true,
            message: 'Please enter your full name!',
            pattern: /^[a-zA-Z]([-']?[a-z]+)*( [a-zA-Z]([-']?[a-z]+)*)+$/,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone number"
        name={['customer', 'phoneNumber']}
        rules={[{ required: true, message: 'Please enter your phone number!' }]}
      >
        <PhoneInput
          inputClass={styles.input}
          inputStyle={{ width: '100%', borderRadius: '2px' }}
        />
      </Form.Item>
    </>
  );
}
