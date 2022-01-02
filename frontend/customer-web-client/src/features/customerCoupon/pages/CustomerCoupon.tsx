import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getTitle } from '../../../utils';
import { CustomerCouponListManagement } from '../components';

export function CustomerCoupon(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>{getTitle('Your orders')}</title>
      </Helmet>

      <Switch>
        <Route
          path={path}
          component={CustomerCouponListManagement}
          exact={true}
        />
      </Switch>
    </>
  );
}
