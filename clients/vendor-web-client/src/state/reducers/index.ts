import { combineReducers } from "redux";
import titleReducer from "./titleReducer";
import orderDialogReducer from "./orderDialogReducer";
import vendorReducer from "./vendorReducer";

const reducers = combineReducers({
  dialog: orderDialogReducer,
  title: titleReducer,
  vendor: vendorReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
