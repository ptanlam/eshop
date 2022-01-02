import { Row } from 'antd';
import qs from 'qs';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { of, switchMap, tap } from 'rxjs';
import { LoadingIndicator } from '../../../../components/LoadingIndicator';
import { ApplicationContext } from '../../../../contexts';
import { Coupon } from '../../../../models/coupon';
import { PaginationMeta } from '../../../../models/shared';
import { currencyUnitSelector } from '../../../currency/currencySlice';
import { CouponList } from '../CouponList';

export function CouponListManagement(): ReactElement {
  const { couponService } = useContext(ApplicationContext);

  const { search } = useLocation();
  let query = qs.parse(search, { ignoreQueryPrefix: true });

  const currencyUnit = useSelector(currencyUnitSelector);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Coupon[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: query?.limit ? +query.limit : 10,
    offset: query?.offset ? +query.offset : 0,
    total: 0,
  });
  const { limit, offset } = pagination;

  useEffect(() => {
    const fetchCouponList$ = of(true)
      .pipe(
        tap(() => setLoading(true)),
        switchMap(() => couponService!.getList(limit, offset, currencyUnit))
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
  }, [couponService, limit, offset, currencyUnit]);

  return (
    <Row style={{ minHeight: '80vh' }} align="middle" justify="center">
      {loading ? <LoadingIndicator /> : <CouponList list={list} />}
    </Row>
  );
}
