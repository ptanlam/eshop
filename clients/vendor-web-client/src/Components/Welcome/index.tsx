import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { vendorAction } from "../../state/index";
import { useAuth0 } from "@auth0/auth0-react";

const Welcome = () => {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const { fetchVendor } = bindActionCreators(vendorAction, dispatch);
  useEffect(() => {
    fetchVendor(user?.sub);
  }, []);

  return (
    <div>
      <h1>Your Dashboard</h1>
    </div>
  );
};

export default Welcome;
