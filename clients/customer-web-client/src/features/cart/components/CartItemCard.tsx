import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Row, Space, Typography } from 'antd';
import { push } from 'connected-react-router';
import getSymbolFromCurrency from 'currency-symbol-map';
import { motion } from 'framer-motion';
import React, { ReactElement, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { delay, of, tap } from 'rxjs';
import { RootState } from '../../../app/store';
import { ManipulationOperator } from '../../../enums';
import { useUserData } from '../../../hooks';
import { cartActions, cartItemSelector } from '../cartSlice';
import { CartItemListContext } from '../contexts';
import styles from './CartItemCard.module.css';

interface CartItemCardProps {
  productId: string;
}

export default function CartItemCard({
  productId,
}: CartItemCardProps): ReactElement {
  const dispatch = useDispatch();
  const { accessToken, user } = useUserData();
  const { limit, offset } = useContext(CartItemListContext);

  const [animation, setAnimation] = useState({ x: '0' });

  const onSwipedLeftHandler = useSwipeable({
    onSwipedLeft: () => onRemoveItemClick(),
    delta: { left: 100 },
  });

  // in order to use the item from props
  // get item from store and always get the up-to-date one
  const item = useSelector((state: RootState) =>
    cartItemSelector(state, productId)
  );

  const {
    name,
    image,
    price,
    unit: priceUnit,
    quantity,
    vendorId,
    vendorName,
    vendorLogoUrl,
  } = item!;

  const onRemoveItemClick = () => {
    setAnimation((prev) => ({ ...prev, x: '-100vw' }));

    of(true)
      .pipe(
        delay(300),
        tap(() =>
          dispatch(
            cartActions.removeItem({
              limit,
              offset,
              productId,
              email: user?.email,
              accessToken,
            })
          )
        )
      )
      .subscribe();
  };

  const onViewDetailsClick = () => {
    dispatch(push(`/products/${productId}`));
  };

  const onManipulateQuantityClick = (operator: ManipulationOperator) => {
    if (quantity === 1 && operator === ManipulationOperator.Subtract) {
      onRemoveItemClick();
      return;
    }

    dispatch(
      cartActions.manipulateItemQuantity({
        productId,
        operator,
        quantity: 1,
        email: user?.email,
        accessToken,
      })
    );
  };

  return (
    <motion.div
      className={styles.container}
      animate={{ ...animation }}
      {...onSwipedLeftHandler}
    >
      <div
        style={{ backgroundImage: `url(${image})` }}
        className={styles.media}
      ></div>

      <div className={styles.informationContainer}>
        <Typography.Text ellipsis>
          <span className={styles.label}>Name:</span>{' '}
          <span className={styles.name} onClick={onViewDetailsClick}>
            {name}
          </span>
        </Typography.Text>

        <Space align="center">
          <Typography.Text className={styles.label}>Quantity:</Typography.Text>
          <Button
            icon={<MinusOutlined />}
            shape="circle"
            size="small"
            onClick={() =>
              onManipulateQuantityClick(ManipulationOperator.Subtract)
            }
          ></Button>
          <Typography.Text className={styles.quantity} ellipsis>
            {quantity}
          </Typography.Text>
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={() => onManipulateQuantityClick(ManipulationOperator.Add)}
          ></Button>
        </Space>

        <Typography.Text className={styles.price} ellipsis>
          <span className={styles.label}>Total:</span>{' '}
          {getSymbolFromCurrency(priceUnit)}
          {price.toLocaleString()}
        </Typography.Text>

        <Row align="middle">
          <div
            style={{ backgroundImage: `url(${vendorLogoUrl})` }}
            className={styles.vendorMedia}
          ></div>
          <Typography.Text
            ellipsis
            strong
            style={{ fontSize: '0.8rem', cursor: 'pointer' }}
            onClick={() => dispatch(push(`/vendors/${vendorId}`))}
          >
            {vendorName}
          </Typography.Text>
        </Row>
      </div>

      <div className={styles.removeButtonContainer}>
        <div className={styles.removeButton} onClick={onRemoveItemClick}>
          X
        </div>
      </div>
    </motion.div>
  );
}
