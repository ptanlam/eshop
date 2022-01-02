import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coupon } from "../../models";
import {
  addNewCoupon,
  deleteCouponById,
  getAllCoupons,
  getAllCouponsByCouponName,
  getAllCouponsByCouponType,
  updateCouponInformation,
  updateStatusCoupon,
} from "./couponsThunk";

export interface CouponsSliceState {
  fetchingCoupons: boolean;
  coupons: Coupon[];
  pagination: CouponsPagination;
}

export interface CouponsPagination {
  total: number;
}

const initialState: CouponsSliceState = {
  fetchingCoupons: false,
  coupons: [],
  pagination: { total: 0 },
};

export const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get all coupons
    builder.addCase(getAllCoupons.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(
      getAllCoupons.fulfilled,
      (
        state,
        action: PayloadAction<{ data: Coupon[]; pagination: CouponsPagination }>
      ) => {
        state.fetchingCoupons = false;
        state.coupons = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
      }
    );
    builder.addCase(getAllCoupons.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Get coupons by couponType
    builder.addCase(getAllCouponsByCouponType.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(
      getAllCouponsByCouponType.fulfilled,
      (
        state,
        action: PayloadAction<{ data: Coupon[]; pagination: CouponsPagination }>
      ) => {
        state.fetchingCoupons = false;
        state.coupons = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
      }
    );
    builder.addCase(getAllCouponsByCouponType.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Get coupons by couponName
    builder.addCase(getAllCouponsByCouponName.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(
      getAllCouponsByCouponName.fulfilled,
      (
        state,
        action: PayloadAction<{
          data: Coupon[];
          pagination: CouponsPagination;
        }>
      ) => {
        state.fetchingCoupons = false;
        state.coupons = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
      }
    );
    builder.addCase(getAllCouponsByCouponName.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Add new coupon
    builder.addCase(addNewCoupon.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(addNewCoupon.fulfilled, (state, action) => {
      state.fetchingCoupons = false;
    });
    builder.addCase(addNewCoupon.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Update coupon informaiton
    builder.addCase(updateCouponInformation.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(
      updateCouponInformation.fulfilled,
      (state, action: PayloadAction<any>) => {
        const indexOfUpdatedCoupon = state.coupons.findIndex(
          (coupon) => coupon.id === action.payload.id
        );
        state.fetchingCoupons = false;
        state.coupons[indexOfUpdatedCoupon] = action.payload;
      }
    );
    builder.addCase(updateCouponInformation.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Delete coupon by id
    builder.addCase(deleteCouponById.pending, (state, action) => {
      state.fetchingCoupons = true;
    });
    builder.addCase(
      deleteCouponById.fulfilled,
      (state, action: PayloadAction<Coupon>) => {
        state.fetchingCoupons = false;
        state.coupons = [
          ...state.coupons.filter((coupon) => coupon.id !== action.payload.id),
        ];
      }
    );
    builder.addCase(deleteCouponById.rejected, (state, action) => {
      state.fetchingCoupons = false;
    });

    // Update activation of coupon
    builder.addCase(
      updateStatusCoupon.fulfilled,
      (state, action: PayloadAction<Coupon>) => {
        const coupon = state.coupons.findIndex(
          (coupon) => coupon.id === action.payload.id
        );
        state.coupons[coupon].isActive = action.payload.isActive;
      }
    );
  },
});

export default couponsSlice.reducer;
