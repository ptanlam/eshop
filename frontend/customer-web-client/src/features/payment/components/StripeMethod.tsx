import { loadStripe } from '@stripe/stripe-js';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { mergeMap, of, tap } from 'rxjs';
import { LoadingOutlined } from '@ant-design/icons';
import { STRIPE_API_KEY } from '../../../configs';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { Col, Form, Row } from 'antd';
import { ApplicationContext } from '../../../contexts';
import styles from './StripeMethod.module.css';

interface StripeMethodProps {
  type: any;
  totalPrice: number;
  totalPriceUnit: string;
}

const stripe = loadStripe(STRIPE_API_KEY);

export function StripeMethod({
  type,
  totalPrice,
  totalPriceUnit,
}: StripeMethodProps): ReactElement {
  const { paymentService } = useContext(ApplicationContext);

  const [fetching, setFetching] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchClientSecret$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        mergeMap(() =>
          paymentService!
            .getClientSecret(type, totalPrice, totalPriceUnit, ['card'])
            .pipe(tap(({ client_secret }) => setClientSecret(client_secret)))
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchClientSecret$.unsubscribe();
  }, [paymentService, totalPrice, totalPriceUnit, type]);

  const show = !fetching && !!clientSecret;

  return (
    <Row justify="center" style={{ marginBottom: '1rem' }}>
      <Col xs={24}>
        {fetching && (
          <Row justify="center">
            <LoadingOutlined />
          </Row>
        )}
      </Col>

      <Col xs={24}>
        {show && (
          <Elements stripe={stripe} options={{ clientSecret }}>
            <Form.Item label="Card details" name={['payment', 'source']}>
              <CardElement className={styles.stripe} />
            </Form.Item>
          </Elements>
        )}
      </Col>
    </Row>
  );
}
