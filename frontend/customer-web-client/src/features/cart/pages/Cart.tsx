import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { getTitle } from '../../../utils';
import { CartItemListManagement } from '../components';

export function Cart(): ReactElement {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>{getTitle('Cart')}</title>
      </Helmet>

      <Switch>
        <Route path={path} exact component={CartItemListManagement} />
      </Switch>
    </>
  );
}
