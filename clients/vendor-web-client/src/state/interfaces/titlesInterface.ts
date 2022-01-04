import { TitleTypes } from "../types/titleTypes";

interface ShopInfo {
  type: TitleTypes.SHOPINFO;
}

interface Products {
  type: TitleTypes.PRODUCTS;
}

interface Orders {
  type: TitleTypes.ORDERS;
}

interface Reviews {
  type: TitleTypes.REVIEWS;
}

interface Analytics {
  type: TitleTypes.ANALYTICS;
}

interface Discounts {
  type: TitleTypes.DISCOUNTS;
}

export type TitleAction =
  | ShopInfo
  | Products
  | Orders
  | Reviews
  | Analytics
  | Discounts;
