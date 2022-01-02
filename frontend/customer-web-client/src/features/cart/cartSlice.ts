import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ManipulationOperator } from '../../enums';
import { BasketItem, BasketMetadata } from '../../models/basket';
import { ListResponse, PaginationMeta } from '../../models/shared';

export interface CartState {
  itemList: Array<BasketItem>;
  numberOfItems: number;
  metadata: BasketMetadata;
  pagination: PaginationMeta;

  fetchingList: boolean;
}

const initialState: CartState = {
  itemList: [],
  numberOfItems: 0,
  metadata: { totalPrice: 0, totalQuantity: 0, unit: 'N/A' },
  pagination: { limit: 0, offset: 0, total: 0 },

  fetchingList: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchBasket: (
      state,
      action: PayloadAction<{
        limit: number;
        offset: number;
        email?: string;
        accessToken?: string;
      }>
    ) => {
      state.fetchingList = true;
      state.pagination.limit = action.payload.limit;
      state.pagination.offset = action.payload.offset;
    },

    fetchBasketFulfilled: (
      state,
      action: PayloadAction<ListResponse<BasketItem>>
    ) => {
      state.itemList = action.payload.data;
      state.pagination.total = action.payload.pagination.total;
      state.fetchingList = false;
    },

    fetchNumberOfItems: (
      state,
      action: PayloadAction<{ email?: string; accessToken?: string }>
    ) => {},

    fetchNumberOfItemsFulfilled: (state, action: PayloadAction<number>) => {
      state.numberOfItems = action.payload;
    },

    fetchMetadata: (
      state,
      action: PayloadAction<{
        unit: string;
        email?: string;
        accessToken?: string;
      }>
    ) => {},

    fetchMetadataFulfilled: (state, action: PayloadAction<BasketMetadata>) => {
      state.metadata = action.payload;
    },

    addItem: (
      state,
      action: PayloadAction<{
        item: BasketItem;
        email?: string;
        accessToken?: string;
      }>
    ) => {},

    addItemFulfilled: (
      state,
      action: PayloadAction<{
        item: BasketItem;
        email?: string;
        accessToken?: string;
      }>
    ) => {},

    manipulateItemQuantity: (
      state,
      action: PayloadAction<{
        quantity: number;
        productId: string;
        operator: ManipulationOperator;
        email?: string;
        accessToken?: string;
      }>
    ) => {
      const itemIndex = state.itemList.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (action.payload.operator === ManipulationOperator.Add) {
        state.itemList[itemIndex].quantity += action.payload.quantity;
        // update metadata immediately on UI
        state.metadata = {
          ...state.metadata,
          totalQuantity: state.metadata.totalQuantity + action.payload.quantity,
          totalPrice:
            state.metadata.totalPrice +
            state.itemList[itemIndex].price * action.payload.quantity,
        };
        return;
      }

      state.itemList[itemIndex].quantity -= action.payload.quantity;
      // update metadata immediately on UI
      state.metadata = {
        ...state.metadata,
        totalQuantity: state.metadata.totalQuantity - action.payload.quantity,
        totalPrice:
          state.metadata.totalPrice -
          state.itemList[itemIndex].price * action.payload.quantity,
      };
    },

    manipulateItemQuantityFulfilled: (
      state,
      action: PayloadAction<BasketItem>
    ) => {},

    removeItem: (
      state,
      action: PayloadAction<{
        limit: number;
        offset: number;
        productId: string;
        email?: string;
        accessToken?: string;
      }>
    ) => {
      const itemIndex = state.itemList.findIndex(
        (i) => i.productId === action.payload.productId
      );

      state.metadata = {
        ...state.metadata,
        totalQuantity:
          state.metadata.totalQuantity - state.itemList[itemIndex].quantity,
        totalPrice:
          state.metadata.totalPrice -
          state.itemList[itemIndex].price * state.itemList[itemIndex].quantity,
      };

      state.itemList = state.itemList.filter(
        (i) => i.productId !== action.payload.productId
      );
    },

    removeItemFulfilled: (
      state,
      action: PayloadAction<{
        email?: string;
        accessToken?: string;
        item: BasketItem;
      }>
    ) => {
      // ! get email and access token to get then number of items
      // ! in basket after removing item

      if (!action.payload.item) return;
      state.itemList.push(action.payload.item);
    },
  },
});

export const cartActions = cartSlice.actions;

export const cartItemListSelector = (state: RootState) => state.cart.itemList;

export const cartItemSelector = (state: RootState, productId: string) =>
  state.cart.itemList.find((i) => i.productId === productId);

export const numberOfItemsInCartSelector = (state: RootState) =>
  state.cart.numberOfItems;

export const cartMetadataSelector = (state: RootState) => state.cart.metadata;

export const cartPaginationSelector = (state: RootState) =>
  state.cart.pagination;

const cartReducer = cartSlice.reducer;
export default cartReducer;
