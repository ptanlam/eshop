import { Observable } from 'rxjs';
import { Review } from '../models/review';
import { ListResponse } from '../models/shared';

export interface IReviewService {
  fetchForTarget(
    limit: number,
    offset: number,
    targetId: string
  ): Observable<ListResponse<Review>>;

  addToTarget(accessToken: string, review: FormData): Observable<Review>;
}
