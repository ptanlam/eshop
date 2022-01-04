import IOrders from "../../Components/Orders/interfaces";

interface OpenDialog {
  type: "OPEN";
  payload: { data: IOrders; dialogState: boolean };
}
interface CloseDialog {
  type: "CLOSE";
  payload: { dialogState: boolean };
}

export type DialogAction = OpenDialog | CloseDialog;
