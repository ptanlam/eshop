import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import { BasketItem } from '../../../models/basket';
import CartItemCard from './CartItemCard';
import styles from './CartItemList.module.css';

interface CartItemListProps {
  list: Array<BasketItem>;
}

export function CartItemList({ list }: CartItemListProps): ReactElement {
  return (
    <motion.div className={styles.container} animate={{ padding: 5 }}>
      <Row gutter={[16, 16]}>
        {list.map((item) => (
          <Col xs={24} md={12} key={item.productId}>
            <CartItemCard productId={item.productId} />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}
