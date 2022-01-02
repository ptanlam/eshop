import { FilterOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { Product } from '../../../models/catalog';
import { PaginationMeta } from '../../../models/shared';
import ProductCard from './ProductCard';

interface ProductListProps {
  list: Array<Product>;
  fetching: boolean;
  pagination: PaginationMeta;
  fetchNextProductList: () => void;
  onFilterButtonClick: () => void;
}

export function ProductList({
  list,
  pagination,
  fetchNextProductList,
  fetching,
  onFilterButtonClick,
}: ProductListProps): ReactElement {
  const { limit, offset, total } = pagination;

  const renderResultMeta = () => {
    return total === 1 ? `${total} result` : `${total} results`;
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Row align="middle">
          <Col xs={12}>
            <Typography.Title
              level={5}
              style={{ color: 'var(--font-color-level-3)' }}
            >
              {renderResultMeta()}
            </Typography.Title>
          </Col>

          <Col xs={12}>
            <Row justify="end">
              <Button
                disabled={fetching}
                icon={<FilterOutlined />}
                onClick={onFilterButtonClick}
                type="text"
                size="large"
              >
                <Typography.Text strong>Filter</Typography.Text>
              </Button>
            </Row>
          </Col>
        </Row>
      </Col>

      <Col xs={24}>
        <InfiniteScroll
          dataLength={list.length}
          next={fetchNextProductList}
          hasMore={limit * (offset + 1) < total}
          loader={<></>}
          style={{ overflow: 'unset' }}
        >
          <Row gutter={[16, 16]}>
            {list.map((product) => (
              <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      </Col>

      {fetching && (
        <Col xs={24}>
          <LoadingIndicator />
        </Col>
      )}
    </Row>
  );
}
