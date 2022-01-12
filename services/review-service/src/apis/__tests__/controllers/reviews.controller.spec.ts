import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import {
  FilesService,
  ReactionsService,
  ReviewsService,
} from '../../../domain/services';
import { mockReviewsService, testReview, testReviews } from '../../../helpers';
import { ReviewsController } from '../../controllers';
import { GetReviewsByConditionsDto, ReviewCreationDto } from '../../dtos';

describe('ReviewsController unit tests', () => {
  let reviewsController: ReviewsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        { provide: ReviewsService, useValue: mockReviewsService },
        {
          provide: FilesService,
          useValue: {
            getAllForOwner: jest.fn().mockReturnValue(of({ files: [] })),
          },
        },
        {
          provide: ReactionsService,
          useValue: {
            getAllForTarget: jest.fn().mockReturnValue(of({ reactions: [] })),
          },
        },
      ],
    }).compile();

    reviewsController = moduleRef.get<ReviewsController>(ReviewsController);
  });

  describe('getReviewsByConditions', () => {
    it('should return expected reviews', async () => {
      const dto: GetReviewsByConditionsDto = {
        limit: 10,
        offset: 0,
      };

      const result = await firstValueFrom(
        reviewsController.getReviewsByConditions(dto),
      );

      expect(result.pagination.total).toStrictEqual(testReviews.length);
      expect(mockReviewsService.getReviewsByConditions).toBeCalled();
    });
  });

  describe('addReview', () => {
    it('should return expected review and call addReview function', async () => {
      const dto: ReviewCreationDto = {
        content: 'this product is amazing',
        rating: 5,
        targetId: uuidV4(),
        reviewerId: 'reviewerId',
        reviewerFullName: 'Full Name',
        reviewerAvatarUrl: 'http://image.com/reviewerId',
      };

      const review = await firstValueFrom(reviewsController.addReview(dto));

      expect(mockReviewsService.addReview).toBeCalled();
    });
  });

  describe('getCountAndRatingForProduct', () => {
    it('should return expected number of reviews, rating and call getCountAndRatingForProduct', async () => {
      const expectedRating =
        testReviews.reduce((prev, curr) => prev + curr.rating, 0) /
        testReviews.length;

      const { response } = await firstValueFrom(
        reviewsController.getCountAndRatingForTarget({
          targetIds: `${uuidV4()},${uuidV4()}`,
        }),
      );

      expect(response[0].numberOfReviews).toBe(testReviews.length);
      expect(response[0].rating).toBe(expectedRating);
      expect(mockReviewsService.getCountAndRating).toBeCalled();
    });
  });
});
