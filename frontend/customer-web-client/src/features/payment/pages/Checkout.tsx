import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CheckoutFormManagement } from '../components';

export function Checkout(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={CheckoutFormManagement} />
    </Switch>
  );
}
