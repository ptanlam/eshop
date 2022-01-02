import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ProductDetailsManagement, ProductListManagement } from '../components';

export function Product(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={ProductListManagement} />
      <Route path={`${path}/:id`} component={ProductDetailsManagement} />
    </Switch>
  );
}
