import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/categoriesSlice";
import vendorsReducer from "../features/vendors/vendorsSlice";
import couponsReducer from "../features/coupon/couponsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    vendors: vendorsReducer,
    coupons: couponsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
