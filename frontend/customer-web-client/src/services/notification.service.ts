import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { INotificationService } from '../interfaces';
import { Notification } from '../models/notification';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';

export class NotificationService
  extends BaseService
  implements INotificationService
{
  private readonly _serviceUrl = `${API_GATEWAY_URL}/notifications`;

  fetchListForCustomer(
    limit: number,
    offset: number,
    email: string,
    accessToken: string
  ): Observable<ListResponse<Notification>> {
    return this.getAuthenticatedHttpClient<ListResponse<Notification>>(
      {
        method: HttpMethod.GET,
        url: this._serviceUrl,
        queries: { limit, offset, email },
      },
      accessToken
    );
  }

  markListToBeSeen(ids: Array<string>, accessToken: string): Observable<void> {
    return this.getAuthenticatedHttpClient<void>(
      {
        method: HttpMethod.PATCH,
        url: this._serviceUrl,
        queries: {
          notificationIds: ids.join(','),
        },
      },
      accessToken
    );
  }
}
