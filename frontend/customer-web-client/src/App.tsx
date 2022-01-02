import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './App.less';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { cartActions } from './features/cart';
import { Cart } from './features/cart/pages';
import { Category } from './features/category/pages';
import { Coupon } from './features/coupon/pages';
import {
  currencyActions,
  currencyUnitSelector,
} from './features/currency/currencySlice';
import { CustomerCoupon } from './features/customerCoupon/pages';
import { Order } from './features/ordering/pages';
import { Checkout } from './features/payment/pages';
import { Product } from './features/product/pages';
import { Vendor } from './features/vendor/pages';
import { useUserData } from './hooks';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const currencyUnit = useSelector(currencyUnitSelector);
  const { accessToken, user } = useUserData();

  useEffect(() => {
    if (!!currencyUnit) return;
    dispatch(currencyActions.setUnit('usd'));
  }, [currencyUnit, dispatch]);

  useEffect(() => {
    dispatch(
      cartActions.fetchNumberOfItems({ email: user?.email, accessToken })
    );
  }, [dispatch, user?.email, accessToken]);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />

        <Route path="/categories" component={Category} />
        <Route path="/products" component={Product} />
        <Route path="/cart" component={Cart} />
        <Route path="/vendors" component={Vendor} />
        <Route path="/checkout" component={Checkout} />

        <ProtectedRoute path="/orders" component={Order} />
        <ProtectedRoute path="/my-coupons" component={CustomerCoupon} />
        <ProtectedRoute path="/coupons" component={Coupon} />

        <Route path="*" exact component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
