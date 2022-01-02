import { Button, Result } from 'antd';
import { push } from 'connected-react-router';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

export function NotFound(): ReactElement {
  const dispatch = useDispatch();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => dispatch(push('/'))}>
          Back Home
        </Button>
      }
    />
  );
}
