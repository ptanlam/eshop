import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { push } from 'connected-react-router';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { numberOfItemsInCartSelector } from '..';
import { IconButton } from '../../../components/IconButton';
import styles from './CartIconButton.module.css';

export function CartIconButton(): ReactElement {
  const dispatch = useDispatch();

  const numberOfItemsInCart = useSelector(numberOfItemsInCartSelector);

  const onClick = () => {
    dispatch(push('/cart?limit=10&offset=0'));
  };

  return (
    <Badge
      color="blue"
      count={numberOfItemsInCart}
      overflowCount={99}
      offset={[-5, 10]}
      className={styles.container}
    >
      <IconButton icon={<ShoppingCartOutlined />} onClick={onClick} />
    </Badge>
  );
}
