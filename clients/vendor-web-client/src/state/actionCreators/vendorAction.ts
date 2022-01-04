import { VendorAction } from "../interfaces/vendorInterface";
import { Dispatch } from "redux";
import { VENDOR_URL } from "../../url";
import axios from "axios";

export const fetchVendor = (id?: string) => {
  return async (dispatch: Dispatch<VendorAction>) => {
    return await axios
      .get(`${VENDOR_URL}?ownerId=${id}&limit=10&offset=0`)
      .then((res) => {
        const { data } = res.data;
        dispatch({
          type: "FETCH",
          payload: data,
        });
      })
      .catch(() => {
        dispatch({
          type: "FETCH",
          payload: [],
        });
      });
  };
};

export const getVendor = () => {
  return (dispatch: Dispatch<VendorAction>) => {
    dispatch({ type: "GET" });
  };
};
