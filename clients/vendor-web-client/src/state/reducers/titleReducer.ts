import { TitleAction } from "../interfaces/titlesInterface";
import { TitleTypes } from "../types/titleTypes";

const initialState = "Dashboard";

const titleReducer = (state = initialState, action: TitleAction) => {
  switch (action.type) {
    case TitleTypes.SHOPINFO:
      return "Thông Tin Shop";
    case TitleTypes.PRODUCTS:
      return "Sản Phẩm";
    case TitleTypes.ORDERS:
      return "Đơn Hàng";
    case TitleTypes.DISCOUNTS:
      return "Khuyến Mãi";
    case TitleTypes.REVIEWS:
      return "Đánh Giá";
    case TitleTypes.ANALYTICS:
      return "Analytics";
    default:
      return state;
  }
};

export default titleReducer;
