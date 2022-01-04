import { DialogAction } from "../interfaces/orderDialogInterface";

const initialState = "";

const orderDialogReducer = (state = initialState, action: DialogAction) => {
  switch (action.type) {
    case "OPEN":
      return action.payload;
    case "CLOSE":
      return action.payload;
    default:
      return state;
  }
};

export default orderDialogReducer;
