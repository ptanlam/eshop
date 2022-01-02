import { Col, Row } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { map, of, switchMap, tap } from 'rxjs';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ApplicationContext } from '../../contexts';
import ProductCard from '../../features/product/components/ProductCard';
import { Product } from '../../models/catalog';
import { PaginationMeta } from '../../models/shared';

export function Home(): ReactElement {
  const { catalogService } = useContext(ApplicationContext);

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: 8,
    offset: 0,
    total: 0,
  });
  const { limit, offset, total } = pagination;

  useEffect(() => {
    const fetchProductList$ = of(true)
      .pipe(
        tap(() => setLoading(true)),
        switchMap(() =>
          catalogService!.fetchProductList(limit, 0).pipe(
            map((resp) => {
              setProductList(resp.data);
              setPagination((prev) => ({ ...prev, ...resp.pagination }));
            })
          )
        )
      )
      .subscribe({
        error: () => setLoading(false),
        complete: () => setLoading(false),
      });

    return () => fetchProductList$.unsubscribe();
  }, [catalogService, limit]);

  const fetchNextProductList = () => {
    // if product is being fetched, then do nothing
    if (loading) return;

    of(true)
      .pipe(
        tap(() => setLoading(true)),
        switchMap(() =>
          catalogService!.fetchProductList(limit, offset + 1).pipe(
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
        error: () => setLoading(false),
        complete: () => setLoading(false),
      });
  };

  return (
    <Row>
      <Col xs={24}>
        <InfiniteScroll
          dataLength={productList.length}
          next={fetchNextProductList}
          hasMore={limit * (offset + 1) < total}
          loader={<></>}
          style={{ overflow: 'unset' }}
        >
          <Row gutter={[16, 16]}>
            {productList.map((product) => (
              <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      </Col>

      {loading && (
        <Col xs={24}>
          <LoadingIndicator />
        </Col>
      )}
    </Row>
  );
}
