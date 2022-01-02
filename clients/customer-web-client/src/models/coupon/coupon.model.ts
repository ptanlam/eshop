export interface Coupon {
  email: string;
  id: string;
  couponName: string;
  code: string;
  couponType: string;
  modifier: number;
  amount: number;
  unit: string;
  quantity: number;
  createdAt: Date;
  images: any[];
}
