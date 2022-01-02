import React, { ReactElement } from 'react';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  List,
  Row,
  Timeline,
  Typography,
} from 'antd';
import { OrderDetails as OrderDetailsModel } from '../../../models/ordering';
import styles from './OrderDetails.module.css';
import ButtonGroup from 'antd/lib/button/button-group';

interface OrderDetailsProps {
  order: OrderDetailsModel;
  toggleEditModal: () => void;
  toggleCancellationModal: () => void;
}

const { Text, Title, Paragraph } = Typography;
export function OrderDetails({
  order,
  toggleEditModal,
  toggleCancellationModal,
}: OrderDetailsProps): ReactElement {
  const {
    shippingAddress,
    notes,
    customer,
    status,
    receipt,
    items,
    totalPrice,
    priceUnit,
    journeys,
    canBeManipulated,
  } = order;

  const renderShippingAddressInfo = () => {
    const { id, customerId, ...info } = shippingAddress;
    return Object.values(info).reverse().join(', ');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Row justify="space-between">
          <Col>
            <Text
              strong
              type={receipt.paid ? 'success' : 'danger'}
            >{`This order has ${receipt.paid ? '' : 'not '}been paid.`}</Text>
          </Col>
          <Col>
            {canBeManipulated && (
              <Col xs={24}>
                <ButtonGroup>
                  <Button type="primary" onClick={toggleEditModal}>
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={toggleCancellationModal}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Col>
            )}
          </Col>
        </Row>
      </Col>

      <Col xs={24} xl={8}>
        <Row className={styles.subContainer}>
          <Col xs={24}>
            <Title level={4} style={{ color: 'var(--btn-primary-color)' }}>
              Information
            </Title>
          </Col>

          <Col xs={24}>
            <Descriptions
              column={{ xxl: 1, xl: 1, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item
                label={<Text className={styles.label}>Name</Text>}
              >
                <Text className={styles.text}>{customer.fullName}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text className={styles.label}>Contact</Text>}
              >
                <Text className={styles.text}>{customer.phoneNumber}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text className={styles.label}>Shipping address</Text>}
              >
                <Text className={styles.text}>
                  {renderShippingAddressInfo()}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text className={styles.label}>Notes</Text>}
              >
                <Text className={styles.text}>{notes}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text className={styles.label}>Status</Text>}
              >
                <Text className={styles.text}>{status}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text className={styles.label}>Payment method</Text>}
              >
                <Text className={styles.text}>
                  {receipt.type.toLocaleUpperCase()}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Col>

      <Col xs={24} xl={8}>
        <Row className={styles.subContainer}>
          <Col xs={24}>
            <Title level={4} style={{ color: 'var(--btn-primary-color)' }}>
              Locations
            </Title>
          </Col>

          <Col xs={24}>
            <Timeline mode="alternate" style={{ padding: 10 }}>
              {journeys.map(({ id, location, notes, timeStamp }) => (
                <Timeline.Item
                  key={id}
                  label={new Date(timeStamp).toLocaleString()}
                >
                  <Text strong>{location}</Text>
                  <Paragraph
                    style={{ color: 'var(--font-color-gray)' }}
                    ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                  >
                    Notes: {notes}
                  </Paragraph>
                </Timeline.Item>
              ))}
            </Timeline>
          </Col>
        </Row>
      </Col>

      <Col xs={24} xl={8}>
        <Row className={styles.subContainer}>
          <Col xs={24}>
            <Title level={4} style={{ color: 'var(--btn-primary-color)' }}>
              Items
            </Title>
          </Col>

          <Col xs={24}>
            <List
              dataSource={items}
              pagination={{
                total: items.length,
                defaultCurrent: 1,
                pageSize: 10,
                size: 'small',
                hideOnSinglePage: true,
              }}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.product.imageUrl}
                        size="large"
                        shape="square"
                      />
                    }
                    title={item.product.name}
                    description={
                      <Row>
                        <Col xs={24}>
                          <Text
                            style={{ color: 'var(--font-color-dark-gray)' }}
                          >
                            {`${item.price.toLocaleString()} ${item.priceUnit}`}{' '}
                            x {item.quantity}
                          </Text>
                        </Col>
                        <Col
                          xs={24}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Text
                            style={{ color: 'var(--font-color-dark-gray)' }}
                          >
                            {`${item.totalPrice.toLocaleString()} ${
                              item.priceUnit
                            }`}
                          </Text>
                        </Col>
                      </Row>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>

          <Col xs={24}>
            <Text strong>
              Total: {totalPrice.toLocaleString()} {priceUnit}
            </Text>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
