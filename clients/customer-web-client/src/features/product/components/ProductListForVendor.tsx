import { Col, Row } from 'antd';
import React, { ReactElement } from 'react';
import { Product } from '../../../models/catalog';
import ProductCard from './ProductCard';

interface ProductListForVendorProps {
  list: Array<Product>;
}

export function ProductListForVendor({
  list,
}: ProductListForVendorProps): ReactElement {
  return (
    <Row gutter={[16, 16]} style={{ padding: 10 }}>
      {list.map((product) => (
        <Col key={product.id} xs={24} md={12} lg={8}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}
