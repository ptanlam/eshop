import qs from 'qs';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import { Product } from '../../../models/catalog';
import { PaginationMeta } from '../../../models/shared';
import { getTitle } from '../../../utils';
import { ProductFilterManagement } from './ProductFilterManagement';
import { ProductList } from './ProductList';

export function ProductListManagement(): ReactElement {
  const { search } = useLocation();
  const { catalogService } = useContext(ApplicationContext);
  const conditions = useMemo(
    () => qs.parse(search, { ignoreQueryPrefix: true }),
    [search]
  );

  const [productFilterVisibility, setProductFilterVisibility] = useState(false);
  const [productList, setProductList] = useState<Array<Product>>([]);
  const [fetching, setFetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const { limit, offset } = pagination;

  useEffect(() => {
    const fetchProductList$ = of(true)
      .pipe(
        tap(() => {
          setFetching(true);
          // * clear all the old ones on the first fetching
          setProductList([]);
        }),
        mergeMap(() =>
          catalogService!.fetchProductList(10, 0, conditions).pipe(
            tap((response) => {
              setProductList(response.data);
              setPagination((prev) => ({ ...prev, ...response.pagination }));
            })
          )
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchProductList$.unsubscribe();
  }, [catalogService, conditions]);

  const fetchNextProductList = () => {
    // if product is being fetched, then do nothing
    if (fetching) return;

    of(true)
      .pipe(
        tap(() => setFetching(true)),
        mergeMap(() =>
          catalogService!.fetchProductList(limit, offset + 1, conditions).pipe(
            tap((response) => {
              setProductList((prev) => [...prev, ...response.data]);
              // set pagination for future fetching
              setPagination((prev) => ({
                ...prev,
                ...response.pagination,
                offset: prev.offset + 1,
              }));
            })
          )
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });
  };

  const toggleProductFilterVisibility = () => {
    setProductFilterVisibility(!productFilterVisibility);
  };

  return (
    <>
      <Helmet>
        <title>{getTitle('Products')}</title>
      </Helmet>

      <ProductList
        list={productList}
        fetching={fetching}
        pagination={pagination}
        onFilterButtonClick={toggleProductFilterVisibility}
        fetchNextProductList={fetchNextProductList}
      />

      <ProductFilterManagement
        onClose={toggleProductFilterVisibility}
        visible={productFilterVisibility}
      />
    </>
  );
}
