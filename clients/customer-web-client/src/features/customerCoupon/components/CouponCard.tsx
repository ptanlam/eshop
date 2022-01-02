import { Card, Descriptions, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { Coupon } from '../../../models/coupon';

interface CouponCardProps {
  coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps): ReactElement {
  return (
    <Card
      cover={
        <div
          style={{
            backgroundImage: `url(${coupon.images[0]})`,
            height: '150px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      }
      title={
        <>
          <Typography.Title level={4} ellipsis>
            {coupon.couponName}
          </Typography.Title>
          <Typography.Text
            type="secondary"
            strong
            style={{ fontSize: '0.9em' }}
          >
            Code: {coupon.code}
          </Typography.Text>
        </>
      }
    >
      <Descriptions column={{ xs: 1, sm: 1 }}>
        <Descriptions.Item label="Quantity">
          {coupon.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Value">
          {coupon.couponType === 'cash'
            ? `${coupon.amount.toLocaleString()} ${coupon.unit}`
            : `${coupon.modifier}%`}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
