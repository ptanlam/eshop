import { useAuth0 } from '@auth0/auth0-react';
import { Col, Pagination, Row } from 'antd';
import qs from 'qs';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { filter, mergeMap, of, tap } from 'rxjs';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ApplicationContext } from '../../../contexts';
import { useUserData } from '../../../hooks';
import { Coupon } from '../../../models/coupon';
import { PaginationMeta } from '../../../models/shared';
import { currencyUnitSelector } from '../../currency/currencySlice';
import { CustomerCouponList } from './CustomerCouponList';

export function CustomerCouponListManagement(): ReactElement {
  const { isAuthenticated } = useAuth0();
  const { accessToken, user } = useUserData();
  const { couponService } = useContext(ApplicationContext);

  const currencyUnit = useSelector(currencyUnitSelector);

  const { search } = useLocation();
  let query = qs.parse(search, { ignoreQueryPrefix: true });

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Coupon[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: query?.limit ? +query.limit : 10,
    offset: query?.offset ? +query.offset : 0,
    total: 0,
  });
  const { limit, offset, total } = pagination;

  useEffect(() => {
    const fetchCouponList$ = of(true)
      .pipe(
        filter(() => isAuthenticated && !!user?.email),
        tap(() => setLoading(true)),
        mergeMap(() =>
          couponService!.getListForCustomer(
            limit,
            offset,
            user!.email!,
            accessToken,
            currencyUnit
          )
        )
      )
      .subscribe({
        next: (resp) => {
          setList([...resp.data]);
          setPagination((prev) => ({ ...prev, ...resp.pagination }));
          setLoading(false);
        },
        error: () => setLoading(false),
      });

    return () => fetchCouponList$.unsubscribe();
  }, [
    couponService,
    isAuthenticated,
    accessToken,
    user,
    limit,
    offset,
    currencyUnit,
  ]);

  const onPageChange = (pageNum: number) => {
    setPagination((prev) => ({ ...prev, offset: pageNum - 1 }));
  };

  return (
    <>
      <Helmet>
        <title>Coupons</title>
      </Helmet>

      <Row gutter={[16, 16]}>
        <Col xs={24} style={{ minHeight: '80vh' }}>
          {loading ? <LoadingIndicator /> : <CustomerCouponList list={list} />}
        </Col>

        <Col xs={24}>
          <Pagination
            total={total}
            current={offset + 1}
            pageSize={limit}
            size="small"
            onChange={onPageChange}
            hideOnSinglePage
          />
        </Col>
      </Row>
    </>
  );
}
