import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { OrderDetailsManagement, OrderListManagement } from '../components';

export function Order(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={OrderListManagement} />
      <Route path={`${path}/:id`} component={OrderDetailsManagement} />
    </Switch>
  );
}
