import { Col, Pagination, Row, Typography } from 'antd';
import qs from 'qs';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { cartPaginationSelector } from '..';
import { useUserData } from '../../../hooks';
import { PaginationMeta } from '../../../models/shared';
import { cartActions, cartItemListSelector } from '../cartSlice';
import { CartItemListContext } from '../contexts';
import { CartItemList } from './CartItemList';
import { CartMetadata } from './CartMetadata';

export function CartItemListManagement(): ReactElement {
  //TODO: sync basket metadata
  const dispatch = useDispatch();
  const { accessToken, user } = useUserData();
  const { search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  const { total } = useSelector(cartPaginationSelector);
  const itemList = useSelector(cartItemListSelector);

  const [pagination, setPagination] = useState<Omit<PaginationMeta, 'total'>>({
    limit: query.limit ? +query.limit : 10,
    offset: query.offset ? +query.offset : 0,
  });
  const { limit, offset } = pagination;

  useEffect(() => {
    dispatch(
      cartActions.fetchBasket({
        limit,
        offset,
        email: user?.email,
        accessToken,
      })
    );
  }, [dispatch, limit, offset, user?.email, accessToken]);

  useEffect(() => {
    if (itemList.length > 0 || offset === 0) return;
    setPagination((prev) => ({ ...prev, offset: offset - 1 }));
  }, [itemList.length, offset]);

  const onPageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, offset: page - 1 }));
  };

  return (
    <CartItemListContext.Provider
      value={{
        limit,
        offset,
        currentNumberOfItemsOnPage: itemList.length,
      }}
    >
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col xs={24} xl={18}>
          <Col xs={24}>
            <Typography.Title level={2}>Cart</Typography.Title>
          </Col>

          <Col xs={24}>
            <CartItemList list={itemList} />
          </Col>

          <Col xs={24}>
            <Pagination
              size="small"
              pageSize={pagination.limit}
              current={offset + 1}
              onChange={onPageChange}
              total={total}
              hideOnSinglePage={true}
            />
          </Col>
        </Col>

        <Col xs={24} xl={6}>
          <Row align="middle" style={{ height: '100%' }}>
            <CartMetadata list={itemList} />
          </Row>
        </Col>
      </Row>
    </CartItemListContext.Provider>
  );
}
