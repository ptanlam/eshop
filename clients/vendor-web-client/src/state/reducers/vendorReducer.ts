import { VendorAction } from "../interfaces/vendorInterface";

const initialState = {};

const vendorReducer = (state = initialState, action: VendorAction) => {
  switch (action.type) {
    case "FETCH":
      return (state = action.payload);
    case "GET":
      return state;
    default:
      return state;
  }
};

export default vendorReducer;
