import { LoadingOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import React, { ReactElement } from 'react';

export function LoadingIndicator(): ReactElement {
  return (
    <Row align="middle" justify="center" style={{ height: '100%' }}>
      <LoadingOutlined style={{ fontSize: '3rem', color: 'black' }} />
    </Row>
  );
}
