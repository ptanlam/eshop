import React, { ReactElement } from 'react';
import { Col, Row, Typography } from 'antd';
import { Order } from '../../../models/ordering';
import { OrderCard } from './OrderCard';

interface OrderListProps {
  list: Array<Order>;
}

export function OrderList({ list }: OrderListProps): ReactElement {
  return (
    <Row>
      <Col xs={24}>
        <Typography.Title level={2}>Orders</Typography.Title>
      </Col>

      <Col xs={24}>
        <Row gutter={[16, 16]}>
          {list.map((order) => (
            <Col xs={24} sm={12} xl={8} key={order.id}>
              <OrderCard order={order} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
