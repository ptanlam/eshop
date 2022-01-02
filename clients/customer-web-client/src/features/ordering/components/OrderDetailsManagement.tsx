import { useAuth0 } from '@auth0/auth0-react';
import { notification } from 'antd';
import { goBack } from 'connected-react-router';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { filter, mergeMap, of, tap } from 'rxjs';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ApplicationContext } from '../../../contexts';
import { useUserData } from '../../../hooks';
import { OrderDetails } from '../../../models/ordering';
import { getTitle } from '../../../utils';
import { OrderCancellationModal } from './OrderCancellationModal';
import { OrderDetails as OrderDetailsComponent } from './OrderDetails';
import { OrderEditModal } from './OrderEditModal';

export function OrderDetailsManagement(): ReactElement {
  const { orderingService } = useContext(ApplicationContext);
  const { id } = useParams<{ id: UniqueId }>();
  const { isAuthenticated } = useAuth0();
  const { accessToken } = useUserData();
  const dispatch = useDispatch();

  const [fetching, setFetching] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    id: '',
    items: [],
    journeys: [],
    priceUnit: '',
    status: '',
    totalPrice: 0,
    createdAt: '',
    notes: '',
    canBeManipulated: false,

    customer: {
      fullName: '',
      phoneNumber: '',
      email: '',
    },

    shippingAddress: {
      id: -1,
      customerId: '',
      city: '',
      country: '',
      details: '',
      district: '',
      street: '',
      ward: '',
    },

    receipt: {
      amount: 0,
      currency: '',
      paid: false,
      type: '',
    },

    vendor: {
      id: '',
      name: '',
    },
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [cancellationModalVisible, setCancellationModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchOrderDetails$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        filter(() => isAuthenticated),
        mergeMap(() =>
          orderingService!
            .fetchDetailsById(id, accessToken)
            .pipe(tap(setOrderDetails))
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchOrderDetails$.unsubscribe();
  }, [orderingService, isAuthenticated, accessToken, id]);

  const toggleEditModal = () => {
    setEditModalVisible(!editModalVisible);
  };

  const toggleCancellationModal = () => {
    setCancellationModalVisible(!cancellationModalVisible);
  };

  const onSubmit = (values: Partial<OrderDetails>) => {
    orderingService!.updateOrder(id, accessToken, values).subscribe({
      next: (value) => {
        setOrderDetails((prev) => ({ ...prev, notes: value.notes }));
        setEditModalVisible(false);
      },
    });
  };

  const onCancelClick = () => {
    orderingService!.cancelOrder(id, accessToken).subscribe({
      complete: () => {
        setCancellationModalVisible(false);
        dispatch(goBack());
        notification.success({
          message: 'Cancel order successfully!',
          placement: 'bottomRight',
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{getTitle('Order')}</title>
      </Helmet>

      {fetching ? (
        <LoadingIndicator />
      ) : (
        <OrderDetailsComponent
          order={orderDetails}
          toggleEditModal={toggleEditModal}
          toggleCancellationModal={toggleCancellationModal}
        />
      )}

      <OrderEditModal
        details={orderDetails}
        visible={editModalVisible}
        toggleEditModal={toggleEditModal}
        onSubmit={onSubmit}
      />

      <OrderCancellationModal
        visible={cancellationModalVisible}
        onConfirmClick={onCancelClick}
        toggleCancellationModal={toggleCancellationModal}
      />
    </>
  );
}
