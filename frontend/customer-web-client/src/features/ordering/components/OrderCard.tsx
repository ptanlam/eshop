import { push } from 'connected-react-router';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Typography } from 'antd';
import { Order } from '../../../models/ordering';
import styles from './OrderCard.module.css';
import { motion } from 'framer-motion';
import { HomeOutlined } from '@ant-design/icons';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps): ReactElement {
  const dispatch = useDispatch();

  const { id, items, totalPrice, priceUnit, createdAt, vendor, status } = order;
  const firstItem = items[0];

  const onDetailsClick = () => {
    dispatch(push(`/orders/${id}`));
  };

  const renderItemText = () => (items.length > 1 ? 'items' : 'item');

  const renderDateTime = (input: Date) => {
    const dateTime = new Date(input);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  };

  return (
    <Card hoverable style={{ cursor: 'default', borderRadius: 20 }}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <Typography.Text style={{ fontSize: '0.8rem' }}>
            <HomeOutlined /> {vendor.name}
          </Typography.Text>
        </Col>

        <Col xs={24}>
          <Typography.Text strong ellipsis>
            ID: {id}
          </Typography.Text>
        </Col>

        <Col xs={24}>
          <Typography.Text strong ellipsis>
            Status: {status}
          </Typography.Text>
        </Col>

        <Col xs={24}>
          <Typography.Text strong ellipsis>
            Total: {totalPrice.toLocaleString()} {priceUnit}
          </Typography.Text>
        </Col>

        <Col xs={24}>
          <Typography.Text
            strong
            style={{ color: 'var(--font-color-level-3)' }}
          >
            {items.length} {renderItemText()}
          </Typography.Text>
        </Col>

        <Col key={firstItem.id} xs={24}>
          <Row align="middle" gutter={[16, 16]}>
            <Col xs={10}>
              <div
                className={styles.media}
                style={{
                  backgroundImage: `url(${firstItem.product.imageUrl})`,
                }}
              ></div>
            </Col>

            <Col xs={14}>
              <Row>
                <Col xs={24}>
                  <Typography.Text ellipsis strong>
                    {firstItem.product.name}
                  </Typography.Text>
                </Col>
                <Col xs={24}>
                  <Typography.Text
                    ellipsis
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    {firstItem.price.toLocaleString()} {firstItem.priceUnit}
                    <span style={{ fontSize: '.7rem' }}>
                      x{firstItem.quantity}
                    </span>
                  </Typography.Text>
                </Col>
              </Row>
            </Col>

            <Col xs={24}>
              <Typography.Text>
                Purchase Date: {renderDateTime(new Date(createdAt))}
              </Typography.Text>
            </Col>
          </Row>
        </Col>

        <Col xs={24} className={styles.btnContainer}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.25 }}
          >
            <Button
              onClick={onDetailsClick}
              style={{
                background: 'var(--btn-primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 20,
              }}
            >
              See Details
            </Button>
          </motion.div>
        </Col>
      </Row>
    </Card>
  );
}
