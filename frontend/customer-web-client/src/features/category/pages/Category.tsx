import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CategoryListManagement } from '../components';

export function Category(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={CategoryListManagement} />
    </Switch>
  );
}
