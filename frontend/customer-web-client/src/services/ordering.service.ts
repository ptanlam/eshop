import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { IOrderingService } from '../interfaces';
import { Order, OrderDetails } from '../models/ordering';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';

export class OrderingService extends BaseService implements IOrderingService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/orders`;

  fetchList(
    limit: number,
    offset: number,
    email: string,
    accessToken: string
  ): Observable<ListResponse<Order>> {
    return this.getAuthenticatedHttpClient<ListResponse<Order>>(
      {
        method: HttpMethod.GET,
        url: this._serviceUrl,
        queries: { email, limit, offset },
      },
      accessToken
    );
  }

  fetchDetailsById(id: string, accessToken: string): Observable<OrderDetails> {
    return this.getAuthenticatedHttpClient<OrderDetails>(
      {
        method: HttpMethod.GET,
        url: `${this._serviceUrl}/${id}`,
      },
      accessToken
    );
  }

  updateOrder(
    id: string,
    accessToken: string,
    data: Partial<OrderDetails>
  ): Observable<OrderDetails> {
    return this.getAuthenticatedHttpClient<OrderDetails>(
      {
        method: HttpMethod.PATCH,
        url: `${this._serviceUrl}/${id}`,
        body: data,
      },
      accessToken
    );
  }

  cancelOrder(id: string, accessToken: string): Observable<void> {
    return this.getAuthenticatedHttpClient<void>(
      {
        method: HttpMethod.DELETE,
        url: `${this._serviceUrl}/${id}`,
      },
      accessToken
    );
  }
}
