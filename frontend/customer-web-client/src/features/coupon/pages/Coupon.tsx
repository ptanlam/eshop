import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getTitle } from '../../../utils';
import { CouponListManagement } from '../components/CouponListManagement';

export function Coupon(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>{getTitle('Coupons')}</title>
      </Helmet>

      <Switch>
        <Route path={path} exact component={CouponListManagement} />
      </Switch>
    </>
  );
}
