import { Inject, Injectable } from '@nestjs/common';
import { from, iif, map, mergeMap, of, toArray, zip } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { GetReviewsByConditionsDto, ReviewCreationDto } from '../../apis/dtos';
import { reviewsRepositoryProvideToken } from '../../constants';
import { Review, Reviewer } from '../models';
import { ReviewersService } from './reviewers.service';
import { TargetsService } from './targets.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(reviewsRepositoryProvideToken)
    private readonly _reviewsRepository: typeof Review,

    private readonly _reviewersService: ReviewersService,
    private readonly _targetsService: TargetsService,
  ) {}

  getReviewsByConditions(dto: GetReviewsByConditionsDto) {
    const { limit, offset, reviewerId, targetId } = dto;

    let whereClause = {};

    if (reviewerId) whereClause = { ...whereClause, reviewerId };
    if (targetId) whereClause = { ...whereClause, targetId };

    return from(
      this._reviewsRepository.findAndCountAll({
        where: whereClause,
        include: [{ model: Reviewer, attributes: ['fullName', 'avatarUrl'] }],
        limit: limit,
        offset: limit * offset,
        order: [['createdAt', 'DESC']],
      }),
    ).pipe(
      map(({ rows, count }) => ({
        data: rows,
        pagination: { total: count },
      })),
    );
  }

  getCountAndRating(targetIds: Array<string>) {
    return from(targetIds).pipe(
      mergeMap((targetId) => this._targetsService.create(targetId)),
      mergeMap((target) =>
        iif(
          () => !target.reviews || !target.reviews.length,
          of(true).pipe(
            map(() => ({
              numberOfReviews: 0,
              rating: 0,
              productId: target.id,
            })),
          ),
          of(true).pipe(
            mergeMap(() =>
              from(
                this._reviewsRepository.count({
                  where: { targetId: target.id },
                }),
              ).pipe(
                map((numberOfReviews) => ({
                  numberOfReviews,
                  rating: target.getAvgRating(),
                  productId: target!.id,
                })),
              ),
            ),
          ),
        ),
      ),
      toArray(),
    );
  }

  addReview(dto: ReviewCreationDto) {
    const {
      content,
      targetId,
      rating,
      reviewerId,
      reviewerFullName,
      reviewerAvatarUrl,
    } = dto;

    return zip(
      this._reviewersService.create(
        reviewerId,
        reviewerFullName,
        reviewerAvatarUrl,
      ),
      this._targetsService.create(targetId),
    ).pipe(
      mergeMap((response) => {
        const [reviewer, target] = response;

        const review = this._reviewsRepository.build({
          id: uuidV4(),
          content,
          rating,
          reviewerId: reviewer.id,
          targetId: target.id,
        });

        return from(review.save()).pipe(
          mergeMap((review) =>
            this.getById(review.id).pipe(map((review) => review!)),
          ),
        );
      }),
    );
  }

  private getById(id: string) {
    return from(
      this._reviewsRepository.findByPk(id, {
        include: [{ model: Reviewer, attributes: ['fullName', 'avatarUrl'] }],
      }),
    ).pipe(map((review) => review));
  }
}
