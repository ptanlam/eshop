import { Col, Radio, RadioChangeEvent, Row } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { debounceTime, mergeMap, of, tap } from 'rxjs';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ApplicationContext } from '../../../contexts';
import { Category, Product } from '../../../models/catalog';
import { PaginationMeta } from '../../../models/shared';
import { currencyUnitSelector } from '../../currency/currencySlice';
import { ProductListForVendor } from './ProductListForVendor';

interface ProductListForVendorManagementProps {
  id: UniqueId;
  categories: Array<Pick<Category, 'id' | 'name'>>;
}

export function ProductListForVendorManagement({
  id,
  categories,
}: ProductListForVendorManagementProps): ReactElement {
  const { catalogService } = useContext(ApplicationContext);

  const [fetching, setFetching] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [productList, setProductList] = useState<Array<Product>>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const { limit, offset } = pagination;

  const currencyUnit = useSelector(currencyUnitSelector);

  useEffect(() => {
    let conditions: any = {
      brandId: id,
      unit: currencyUnit,
    };

    if (!!categoryId) {
      conditions = {
        ...conditions,
        categoryId,
      };
    }

    const fetchProductList$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        debounceTime(500),
        mergeMap(() =>
          catalogService!.fetchProductList(limit, offset, conditions).pipe(
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
  }, [categoryId, id, limit, offset, catalogService, currencyUnit]);

  const onCategoryChange = (e: RadioChangeEvent) => {
    setCategoryId(e.target.value);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Radio.Group
          onChange={onCategoryChange}
          defaultValue=""
          size="middle"
          buttonStyle="solid"
          style={{
            display: 'flex',
            overflowX: 'scroll',
            marginBottom: 10,
            scrollbarWidth: 'none',
          }}
        >
          <Radio.Button value="">Products</Radio.Button>

          {categories.map((category) => (
            <Radio.Button value={category.id} key={category.id}>
              {category.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Col>

      <Col xs={24}>
        {fetching ? (
          <LoadingIndicator />
        ) : (
          <ProductListForVendor list={productList} />
        )}
      </Col>
    </Row>
  );
}
