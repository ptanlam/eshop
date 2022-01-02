import { Observable } from 'rxjs';
import { Order, OrderDetails } from '../models/ordering';
import { ListResponse } from '../models/shared';

export interface IOrderingService {
  fetchList(
    limit: number,
    offset: number,
    email: string,
    accessToken: string
  ): Observable<ListResponse<Order>>;

  fetchDetailsById(id: string, accessToken: string): Observable<OrderDetails>;

  updateOrder(
    id: string,
    accessToken: string,
    data: Partial<OrderDetails>
  ): Observable<OrderDetails>;

  cancelOrder(id: string, accessToken: string): Observable<void>;
}
