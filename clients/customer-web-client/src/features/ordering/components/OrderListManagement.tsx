import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { getTitle } from '../../../utils';
import qs from 'qs';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserData } from '../../../hooks';
import { Order } from '../../../models/ordering';
import { ApplicationContext } from '../../../contexts';
import { filter, mergeMap, of, tap } from 'rxjs';
import { PaginationMeta } from '../../../models/shared';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { OrderList } from './OrderList';

export function OrderListManagement(): ReactElement {
  const { orderingService } = useContext(ApplicationContext);
  const { isAuthenticated } = useAuth0();
  const { accessToken, user } = useUserData();

  const { search } = useLocation();
  let query = qs.parse(search, { ignoreQueryPrefix: true });

  const [fetching, setFetching] = useState(false);
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: query?.limit ? +query.limit : 10,
    offset: query?.offset ? +query.offset : 0,
    total: 0,
  });
  const { limit, offset } = pagination;

  useEffect(() => {
    const fetchOrderList$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        filter(() => isAuthenticated && !!user?.email && !!accessToken),
        mergeMap(() =>
          orderingService!
            .fetchList(limit, offset, user!.email!, accessToken!)
            .pipe(
              tap((response) => {
                setOrderList(response.data);
                setPagination((prev) => ({ ...prev, ...response.pagination }));
              })
            )
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchOrderList$.unsubscribe();
  }, [orderingService, user, accessToken, limit, offset, isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>{getTitle('Orders')}</title>
      </Helmet>

      {fetching ? <LoadingIndicator /> : <OrderList list={orderList} />}
    </>
  );
}
