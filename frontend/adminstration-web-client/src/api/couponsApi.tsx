import axios from "axios";
import { API_BASE_URL } from "../helpers/configs";
import { Coupon } from "../models";
import axiosClient from "./axiosClient";

const url = "/coupons";

const couponsApi = {
  getAllCoupons(offset: number) {
    return axiosClient.get<string, { data: Coupon[]; pagination: any }>(
      `${url}/all?limit=6&offset=${offset}`
    );
  },

  getAllCouponsByCouponType(offset: number, couponType: string) {
    return axiosClient.get<string, { data: Coupon[]; pagination: any }>(
      `${url}/all/type?limit=6&offset=${offset}&couponType=${couponType}`
    );
  },

  getAllCouponsByCouponName(offset: number, couponName: string) {
    return axiosClient.get<string, { data: Coupon[]; pagination: any }>(
      `${url}/name/details?couponName=${couponName}&limit=6&offset=${offset}`
    );
  },

  addNewCoupon(data: FormData) {
    return axiosClient.post<string, Coupon>(`${url}`, data);
  },
  updateCouponInformation(id: string | undefined, information: any) {
    return axios.patch(`${API_BASE_URL}/coupons?id=${id}`, { ...information });
  },

  updateCouponStatus(id: string | undefined) {
    return axiosClient.patch<string, Coupon>(`${url}/status?id=${id}`);
  },

  deleteCouponById(id: string) {
    return axiosClient.delete<string, Coupon>(`${url}/remove?id=${id}`);
  },
};

export default couponsApi;
