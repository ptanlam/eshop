import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { VendorDetailsManagement } from '../components';

export function Vendor(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/:id`} component={VendorDetailsManagement} />
    </Switch>
  );
}
