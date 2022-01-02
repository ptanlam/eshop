import { Col, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';

export function InProgress(): ReactElement {
  return (
    <Row align="middle" justify="center" style={{ height: '80vh' }}>
      <Col xs={24}>
        <Typography.Title style={{ textAlign: 'center', fontWeight: 400 }}>
          In progress...
        </Typography.Title>
      </Col>
    </Row>
  );
}
