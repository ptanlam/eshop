import React, { ReactElement } from 'react';
import { Col, Descriptions, Row, Typography } from 'antd';
import { Vendor } from '../../../models/vendor';
import { ProductListForVendorManagement } from '../../product/components';

interface VendorDetailsProps {
  vendor: Vendor;
}

export default function VendorDetails({
  vendor,
}: VendorDetailsProps): ReactElement {
  const { logoUrl, name, introduction, hotline, email, id, categories } =
    vendor;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={4} sm={3} lg={2}>
            <img src={logoUrl} alt={name} style={{ width: '100%' }} />
          </Col>
          <Col xs={18} sm={21} lg={22}>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {name}
            </Typography.Title>
          </Col>
        </Row>
      </Col>

      <Col xs={24} xl={6}>
        <Descriptions
          column={{ xs: 1, sm: 1 }}
          title="Details"
          style={{ background: 'white', padding: 10, borderRadius: 10 }}
        >
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Hotline">{hotline}</Descriptions.Item>
          <Descriptions.Item label="Introduction">
            {introduction}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      <Col xs={24} xl={18}>
        <ProductListForVendorManagement id={id} categories={categories} />
      </Col>
    </Row>
  );
}
