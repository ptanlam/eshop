import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { ICouponService } from '../interfaces';
import { Coupon } from '../models/coupon';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';
import qs from 'qs';

export class CouponService extends BaseService implements ICouponService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/coupons`;

  getList(
    limit: number,
    offset: number,
    unit: string
  ): Observable<ListResponse<Coupon>> {
    return this.getHttpClient({
      method: HttpMethod.GET,
      url: `${this._serviceUrl}/users/all?${qs.stringify({
        limit,
        offset,
        unit,
      })}`,
    });
  }

  getListForCustomer(
    limit: number,
    offset: number,
    email: string,
    accessToken: string,
    unit: string
  ): Observable<ListResponse<Coupon>> {
    return this.getAuthenticatedHttpClient(
      {
        method: HttpMethod.GET,
        url: `${this._serviceUrl}?${qs.stringify({
          limit,
          offset,
          email,
          unit,
        })}`,
      },
      accessToken
    );
  }
}
