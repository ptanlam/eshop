import { createAsyncThunk } from "@reduxjs/toolkit";
import couponsApi from "../../api/couponsApi";
import { Coupon } from "../../models";

export const getAllCoupons = createAsyncThunk(
  "coupons/getAllCoupons",
  async (offset: number) => {
    const coupons = await couponsApi.getAllCoupons(offset);
    return coupons;
  }
);

export const getAllCouponsByCouponType = createAsyncThunk(
  "coupons/getAllCouponsByCouponType",
  async ({ offset, couponType }: { offset: number; couponType: string }) => {
    const couponsFilteredByCouponType =
      await couponsApi.getAllCouponsByCouponType(offset, couponType);
    return couponsFilteredByCouponType;
  }
);

export const getAllCouponsByCouponName = createAsyncThunk(
  "coupons/getAllCouponsByCouponName",
  async ({ offset, couponName }: { offset: number; couponName: string }) => {
    const couponsFilteredByCouponName =
      await couponsApi.getAllCouponsByCouponName(offset, couponName);
    return couponsFilteredByCouponName;
  }
);

export const addNewCoupon = createAsyncThunk(
  "coupons/addNewCoupon",
  async (data: FormData) => {
    await couponsApi.addNewCoupon(data);
  }
);

export const updateCouponInformation = createAsyncThunk(
  "coupons/updateCouponInformation",
  async ({ id, data }: { id: string | undefined; data: Coupon }) => {
    const response = await couponsApi.updateCouponInformation(id, data);
    console.log(response);
    return response.data;
  }
);

export const updateStatusCoupon = createAsyncThunk(
  "coupons/updateStatusCoupon",
  async (id: string | undefined) => {
    const response = await couponsApi.updateCouponStatus(id);
    return { ...response };
  }
);

export const deleteCouponById = createAsyncThunk(
  "coupons/deleteCouponById",
  async (id: string) => {
    const coupon = await couponsApi.deleteCouponById(id);
    return coupon;
  }
);
