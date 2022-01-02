import { Skeleton } from 'antd';
import { push } from 'connected-react-router';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import {
  mapProductToBasketItem,
  mapProductToOrderItem,
} from '../../../helpers';
import { useUserData } from '../../../hooks';
import { ProductDetails as ProductDetailModel } from '../../../models/catalog';
import { OrderItemForCreation } from '../../../models/ordering';
import { getTitle } from '../../../utils';
import { cartActions } from '../../cart';
import { currencyUnitSelector } from '../../currency/currencySlice';
import { ProductDetails } from './ProductDetails';

export function ProductDetailsManagement(): ReactElement {
  const dispatch = useDispatch();
  const currencyUnit = useSelector(currencyUnitSelector);
  const { catalogService } = useContext(ApplicationContext);
  const { accessToken, user } = useUserData();
  const { id } = useParams<{ id: UniqueId }>();

  const [fetching, setFetching] = useState(false);
  const [product, setProduct] = useState<ProductDetailModel>({
    id: '',
    name: '',
    slug: '',
    stock: 0,
    briefDescription: '',
    detailDescription: '',
    price: { amount: 0, unit: '' },
    vendor: { logoUrl: '', name: '', id: '', slug: '' },
    images: [{ url: '', id: '', ownerId: '' }],
    attributes: [],
  });

  useEffect(() => {
    const fetchDetails$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        mergeMap(() =>
          catalogService!
            .fetchProductById(id, currencyUnit)
            .pipe(tap((product) => setProduct(product)))
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchDetails$.unsubscribe();
  }, [catalogService, id, currencyUnit]);

  const onAddToCartClick = () => {
    dispatch(
      cartActions.addItem({
        item: mapProductToBasketItem(product),
        email: user?.email,
        accessToken,
      })
    );
  };

  const onCheckoutClick = () => {
    // immediately checkout this item
    dispatch(
      push('/checkout', {
        items: new Array<OrderItemForCreation>({
          ...mapProductToOrderItem(product),
        }),
      })
    );
  };

  const onViewVendorDetailsClick = () => {
    dispatch(push(`/vendors/${product.vendor.id}`));
  };

  return (
    <>
      <Helmet>
        <title>{getTitle(product.name)}</title>
      </Helmet>

      {fetching ? (
        <Skeleton active />
      ) : (
        <ProductDetails
          details={product}
          onAddToCartClick={onAddToCartClick}
          onCheckoutClick={onCheckoutClick}
          onViewVendorDetailsClick={onViewVendorDetailsClick}
        />
      )}
    </>
  );
}
