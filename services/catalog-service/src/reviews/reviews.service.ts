import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { reviewsPackageProvideToken } from '../constants';
import { GetCountAndRatingForTargetRequest } from './getCountAndRatingForTargetRequest';
import { getCountAndRatingForTargetResponse } from './getCountAndRatingForTargetResponse';

interface IReviewsService {
  getCountAndRatingForTarget(
    data: GetCountAndRatingForTargetRequest,
  ): Observable<getCountAndRatingForTargetResponse>;
}
@Controller()
export class ReviewsService implements IReviewsService, OnModuleInit {
  private _reviewService!: IReviewsService;

  constructor(
    @Inject(reviewsPackageProvideToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._reviewService =
      this.client.getService<IReviewsService>('ReviewsService');
  }

  getCountAndRatingForTarget(
    data: GetCountAndRatingForTargetRequest,
  ): Observable<getCountAndRatingForTargetResponse> {
    return this._reviewService.getCountAndRatingForTarget(data);
  }
}
