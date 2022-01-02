import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Descriptions } from 'antd';
import { push } from 'connected-react-router';
import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapBasketItemToOrderItem } from '../../../helpers';
import { useUserData } from '../../../hooks';
import { BasketItem } from '../../../models/basket';
import { currencyUnitSelector } from '../../currency/currencySlice';
import { cartActions, cartMetadataSelector } from '../cartSlice';

interface BasketMetadataProps {
  list: Array<BasketItem>;
}

export function CartMetadata({ list }: BasketMetadataProps): ReactElement {
  const { accessToken, user } = useUserData();
  const dispatch = useDispatch();

  const currencyUnit = useSelector(currencyUnitSelector);

  useEffect(() => {
    dispatch(
      cartActions.fetchMetadata({
        unit: currencyUnit,
        email: user?.email,
        accessToken,
      })
    );
  }, [dispatch, user?.email, accessToken, currencyUnit]);

  const metadata = useSelector(cartMetadataSelector);

  const isEmpty = !metadata.totalQuantity;

  const onCheckoutClick = () => {
    dispatch(
      push('/checkout', {
        items: list.map((item) => mapBasketItemToOrderItem(item)),
      })
    );
  };

  return (
    <Descriptions
      title="Details"
      column={{ xs: 1, sm: 1 }}
      extra={
        <Button
          disabled={isEmpty}
          icon={<ArrowRightOutlined />}
          shape="round"
          type="primary"
          onClick={onCheckoutClick}
        >
          Checkout
        </Button>
      }
    >
      <Descriptions.Item label="Total quantity">
        {metadata.totalQuantity}
      </Descriptions.Item>

      <Descriptions.Item label="Total price">
        {metadata.totalPrice.toLocaleString()} {metadata.unit}
      </Descriptions.Item>
    </Descriptions>
  );
}
