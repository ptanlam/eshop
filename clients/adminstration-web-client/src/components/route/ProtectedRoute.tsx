import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ ...props }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <Redirect to="/" />;

  return <Route {...props} />;
};

export default ProtectedRoute;
