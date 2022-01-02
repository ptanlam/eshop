import { useAuth0 } from '@auth0/auth0-react';
import React, { ReactElement } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface ProtectedRouteProps extends RouteProps {}

export function ProtectedRoute({
  children,
  ...props
}: ProtectedRouteProps): ReactElement {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <Redirect to="/" />;

  return <Route {...props}>{children}</Route>;
}
