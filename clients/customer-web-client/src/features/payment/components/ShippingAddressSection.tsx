import { Form, Input } from 'antd';
import React, { ReactElement } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import styles from './CheckoutForm.module.css';

const textRegexPattern = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;

export function ShippingAddressSection(): ReactElement {
  return (
    <>
      {/* TODO: replace with autocomplete */}
      <Form.Item
        label="Country"
        name={['shippingAddress', 'country']}
        rules={[
          {
            required: true,
            message: 'Please enter your country!',
          },
        ]}
      >
        <CountryDropdown
          value=""
          onChange={() => {}}
          classes={styles.countries}
        />
      </Form.Item>

      <Form.Item
        label="City"
        name={['shippingAddress', 'city']}
        rules={[
          {
            required: true,
            message: 'Please enter your city!',
            pattern: /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="Ward"
        name={['shippingAddress', 'ward']}
        rules={[
          {
            required: true,
            message: 'Please enter your ward!',
            pattern: textRegexPattern,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="District"
        name={['shippingAddress', 'district']}
        rules={[
          {
            required: true,
            message: 'Please enter your district!',
            pattern: textRegexPattern,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="Street"
        name={['shippingAddress', 'street']}
        rules={[
          {
            required: true,
            message: 'Please enter your street!',
            pattern: textRegexPattern,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="Address"
        name={['shippingAddress', 'details']}
        rules={[
          {
            required: true,
            message: 'Please enter your details!',
            pattern: textRegexPattern,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
    </>
  );
}
