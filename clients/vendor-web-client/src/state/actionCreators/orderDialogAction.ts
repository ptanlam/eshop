import { Dispatch } from "redux";
import IOrders from "../../Components/Orders/interfaces";
import { DialogAction } from "../interfaces/orderDialogInterface";

export const openDialog = (row: IOrders) => {
  return (dispatch: Dispatch<DialogAction>) => {
    dispatch({
      type: "OPEN",
      payload: {
        data: row,
        dialogState: true,
      },
    });
  };
};

export const closeDialog = () => {
  return (dispatch: Dispatch<DialogAction>) => {
    dispatch({
      type: "CLOSE",
      payload: {
        dialogState: false,
      },
    });
  };
};
