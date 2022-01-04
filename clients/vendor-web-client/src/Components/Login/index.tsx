import React from "react";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <div className="bgImg"></div>
      <div id="welcomeBox">
        <h2>Welcome to Vendor Dashboard</h2>
        <h3>Please login to continue</h3>
        <Button variant="contained" onClick={() => loginWithRedirect()}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
