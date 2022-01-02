import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { IReviewService } from '../interfaces';
import { Review } from '../models/review';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';

export class ReviewService extends BaseService implements IReviewService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/reviews`;

  fetchForTarget(
    limit: number,
    offset: number,
    targetId: string
  ): Observable<ListResponse<Review>> {
    return this.getHttpClient<ListResponse<Review>>({
      method: HttpMethod.GET,
      url: this._serviceUrl,
      queries: { targetId, limit, offset },
    });
  }

  addToTarget(accessToken: string, review: FormData): Observable<Review> {
    return this.getAuthenticatedHttpClient<Review>(
      {
        method: HttpMethod.POST,
        url: this._serviceUrl,
        body: review,
      },
      accessToken
    );
  }
}
