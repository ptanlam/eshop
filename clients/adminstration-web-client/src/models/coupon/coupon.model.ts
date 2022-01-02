import { Image } from "..";

export interface Coupon {
  id?: string;
  code?: string;
  couponName?: string;
  description?: string;
  couponType?: string;
  modifier?: number;
  amount: number;
  unit?: string;
  usage?: number;
  limit?: number;
  pointToAchieve?: number;
  isActive?: boolean;
  startTime: Date | string;
  endTime: Date | string;
  images?: Image[];
}
