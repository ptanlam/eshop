import { Observable } from 'rxjs';
import { Coupon } from '../models/coupon';
import { ListResponse } from '../models/shared';

export interface ICouponService {
  getList(
    limit: number,
    offset: number,
    unit: string
  ): Observable<ListResponse<Coupon>>;

  getListForCustomer(
    limit: number,
    offset: number,
    email: string,
    accessToken: string,
    unit: string
  ): Observable<ListResponse<Coupon>>;
}
