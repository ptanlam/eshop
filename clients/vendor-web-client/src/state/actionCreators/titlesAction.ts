import { TitleTypes } from "../types/titleTypes";
import { Dispatch } from "redux";
import { TitleAction } from "../interfaces/titlesInterface";

export const shopInfo = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.SHOPINFO,
    });
  };
};

export const products = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.PRODUCTS,
    });
  };
};

export const orders = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.ORDERS,
    });
  };
};

export const discounts = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.DISCOUNTS,
    });
  };
};

export const reviews = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.REVIEWS,
    });
  };
};

export const analytics = () => {
  return (dispatch: Dispatch<TitleAction>) => {
    dispatch({
      type: TitleTypes.ANALYTICS,
    });
  };
};
