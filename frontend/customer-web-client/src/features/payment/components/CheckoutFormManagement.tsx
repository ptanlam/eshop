import { useAuth0 } from '@auth0/auth0-react';
import { Button, Col, Modal, Result, Row } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { push } from 'connected-react-router';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { catchError, filter, mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import { useUserData } from '../../../hooks';
import { Coupon } from '../../../models/coupon';
import {
  OrderForCreation,
  OrderItemForCreation,
} from '../../../models/ordering';
import { ReceiptForCreation } from '../../../models/payment';
import { getTitle } from '../../../utils';
import { currencyUnitSelector } from '../../currency/currencySlice';
import { CheckoutDetails } from './CheckoutDetails';
import CheckoutForm from './CheckoutForm';

export function CheckoutFormManagement(): ReactElement {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth0();
  const { user, accessToken } = useUserData();
  const { paymentService, couponService } = useContext(ApplicationContext);
  const { state } = useLocation<{ items: Array<OrderItemForCreation> }>();

  const currencyUnit = useSelector(currencyUnitSelector);

  const [creating, setCreating] = useState(false);
  const [{ totalPrice, totalPriceUnit, totalQuantity }, setMetadata] = useState(
    {
      totalPrice: 0,
      totalPriceUnit: 'N/A',
      totalQuantity: 0,
    }
  );

  const [fetchingCouponList, setFetchingCouponList] = useState(false);
  const [couponList, setCouponList] = useState<Coupon[]>([]);

  const [modal, setModal] = useState({
    status: 'info',
    title: '',
    message: '',
    visible: false,
    success: false,
  });

  useEffect(() => {
    const fetchCouponList$ = of(true)
      .pipe(
        filter(() => isAuthenticated && !!user),
        tap(() => setFetchingCouponList(true)),
        mergeMap(() =>
          couponService!
            .getListForCustomer(10, 0, user!.email!, accessToken, currencyUnit)
            .pipe(tap((resp) => setCouponList(resp.data)))
        )
      )
      .subscribe({
        error: () => setFetchingCouponList(false),
        complete: () => setFetchingCouponList(false),
      });

    return () => fetchCouponList$.unsubscribe();
  }, [isAuthenticated, user, accessToken, couponService, currencyUnit]);

  useEffect(() => {
    if (!state || !state.items) return;

    // we can not rely on the metadata from the store
    // because customer can navigate to the page directly
    // from the product details page
    // without add that item to their cart
    setMetadata((prev) => ({
      ...state.items.reduce(
        ({ totalPrice, totalQuantity }, { price, quantity, priceUnit }) => ({
          totalQuantity: totalQuantity + quantity,
          totalPrice: totalPrice + price * quantity,
          totalPriceUnit: priceUnit,
        }),
        prev
      ),
    }));
  }, [state]);

  // check if customer directly enter this page without buying any item
  // then redirect to cart
  if (!state || !state.items) return <Redirect to="cart?limit=10&offset=0" />;
  const items = state.items;

  const onSubmit = (values: OrderForCreation) => {
    const { customer, payment, shippingAddress, notes } = values;

    const orders = splitOrderIntoChunks().map((order) => ({
      ...order,
      customer: {
        ...customer,
        phone_number: customer.phoneNumber,
      },
      notes,
      shippingAddress,
    }));

    const actualPayment: ReceiptForCreation = {
      type: payment.type,
      source: payment?.source?.brand || '',
      amount: +totalPrice.toFixed(2),
      currency: totalPriceUnit,
    };

    setCreating(true);
    paymentService!
      .create(actualPayment, orders, {
        email: customer.email,
        phone_number: customer.phoneNumber,
      })
      .pipe(
        tap((receipt) => {
          setCreating(false);
          setModal({
            title: 'Congratulations!',
            message: `Receipt id: ${receipt.id}, you will be called by staff in order to confirm this order.`,
            status: 'success',
            visible: true,
            success: true,
          });
        }),
        catchError((error) =>
          of(error).pipe(
            tap(() => {
              setCreating(false);
              setModal({
                title: 'Error payment!',
                message:
                  'Some error occurs when processing your payment. Please try again or try to contact us at ...',
                status: 'error',
                visible: true,
                success: false,
              });
            })
          )
        )
      )
      .subscribe();
  };

  const splitOrderIntoChunks = () => {
    // get ids of all vendors
    const vendorIds = [...new Set(items.map(({ vendorId }) => vendorId))];

    // initial items
    const orders = vendorIds.map((vendorId) => ({
      vendorId,
      items: new Array<any>(),
    }));

    // separate items by vendorName
    items.forEach(({ vendorId, productName, ...item }) => {
      const index = orders.findIndex((o) => o.vendorId === vendorId);
      orders[index].items.push(item);
    });

    return orders;
  };

  const onBackToHomeClick = () => {
    dispatch(push('/'));
  };

  const onReturnClick = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const onCancelClick = () => {
    if (creating) return;

    if (modal.success) {
      onBackToHomeClick();
      return;
    }

    onReturnClick();
  };

  return (
    <>
      <Helmet>{getTitle('Checkout')}</Helmet>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={9}>
          <CheckoutDetails
            fetchingCouponList={fetchingCouponList}
            couponList={couponList}
            items={items}
            totalPrice={totalPrice}
            totalPriceUnit={totalPriceUnit}
            totalQuantity={totalQuantity}
            isAuthenticated={isAuthenticated}
          />
        </Col>

        <Col xs={24} md={15}>
          <CheckoutForm
            onSubmit={onSubmit}
            creating={creating}
            totalPrice={totalPrice}
            totalPriceUnit={totalPriceUnit}
          />
        </Col>
      </Row>

      <Modal
        centered
        onCancel={onCancelClick}
        title="Announcement"
        visible={modal.visible}
        footer={[
          <Button type="primary" onClick={onBackToHomeClick}>
            Back to home
          </Button>,
          <>
            {!modal.success && <Button onClick={onReturnClick}>Return</Button>}
          </>,
        ]}
      >
        <Result
          status={modal.status as ResultStatusType}
          title={modal.title}
          subTitle={modal.message}
        />
      </Modal>
    </>
  );
}
