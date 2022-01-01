export interface CouponFilter {
  id?: string;
  email?: string;
  code?: string;
  couponCode?: string;
  couponName: string;
  description: string;
  couponType: string;
  modifier: number;
  unit: string;
  amount: number;
  usage?: number;
  limit?: number;
  pointToAchieve?: number;
  startTime?: string | Date;
  endTime?: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
  isActive?: string;
  isDeleted?: string;
  images?: Array<{
    id: string;
    ownerId: string;
    url: string;
  }>;
}
export interface CouponFilterResponse {
  data: CouponFilter[];
  pagination?;
}
