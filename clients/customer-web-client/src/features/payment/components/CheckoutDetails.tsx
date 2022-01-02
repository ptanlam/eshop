import { Col, Descriptions, Row, Select, Table, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { Coupon } from '../../../models/coupon';
import { OrderItemForCreation } from '../../../models/ordering';
import styles from './CheckoutDetails.module.css';

interface CheckoutDetailsProps {
  totalPrice: number;
  totalQuantity: number;
  totalPriceUnit: string;
  couponList: Coupon[];
  fetchingCouponList: boolean;
  items: Array<OrderItemForCreation>;
  isAuthenticated: boolean;
}

const { Text } = Typography;
const { Option } = Select;

export function CheckoutDetails({
  items,
  totalPrice,
  couponList,
  totalQuantity,
  totalPriceUnit,
  fetchingCouponList,
  isAuthenticated,
}: CheckoutDetailsProps): ReactElement {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const dataSource = items.map(
    ({ productName, quantity, price, priceUnit, productId }) => ({
      key: productId,
      name: productName,
      quantity,
      price: `${price.toLocaleString()} ${priceUnit}`,
    })
  );

  return (
    <Row className={styles.container}>
      <Col xs={24}>
        <Typography.Title level={4}>Your order</Typography.Title>
      </Col>
      <Col xs={24} className={styles.subContainer}>
        <Descriptions column={{ xs: 1, sm: 1 }}>
          {isAuthenticated && (
            <Descriptions.Item
              label={
                <Text style={{ color: 'var(--font-color-dark-gray)' }}>
                  Coupon
                </Text>
              }
            >
              <Select
                defaultValue={couponList.length ? couponList[0].code : ''}
                style={{ width: '100%' }}
                loading={fetchingCouponList}
              >
                {couponList.map((coupon) => (
                  <Option value={coupon.code} key={coupon.id}>
                    {coupon.couponName} -{' '}
                    {coupon.couponType === 'cash'
                      ? `${coupon.amount.toLocaleString()} ${coupon.unit}`
                      : `${coupon.modifier}`}
                  </Option>
                ))}
              </Select>
            </Descriptions.Item>
          )}
          <Descriptions.Item
            label={
              <Text style={{ color: 'var(--font-color-dark-gray)' }}>
                Total price
              </Text>
            }
          >
            <Text ellipsis>
              {totalPrice.toLocaleString()} {totalPriceUnit}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Text style={{ color: 'var(--font-color-dark-gray)' }}>
                Quantity
              </Text>
            }
          >
            {totalQuantity}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      <Col xs={24}>
        <Row>
          <Col xs={24}>
            <Typography.Title level={4}>Products</Typography.Title>
          </Col>
          <Col xs={24} className={styles.subContainer}>
            <Table
              size="small"
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
