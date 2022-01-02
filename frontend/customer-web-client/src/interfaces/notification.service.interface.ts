import { ListResponse } from '../models/shared';
import { Notification } from '../models/notification';
import { Observable } from 'rxjs';

export interface INotificationService {
  fetchListForCustomer(
    limit: number,
    offset: number,
    email: string,
    accessToken: string
  ): Observable<ListResponse<Notification>>;

  markListToBeSeen(ids: Array<string>, accessToken: string): Observable<void>;
}
