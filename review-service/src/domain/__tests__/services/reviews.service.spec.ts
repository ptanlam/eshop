import { Test } from '@nestjs/testing';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { ReviewCreationDto } from '../../../apis/dtos';
import {
  reviewersRepositoryProvideToken,
  reviewsRepositoryProvideToken,
  targetsRepositoryProvideToken,
} from '../../../constants';
import {
  mockReviewersRepository,
  mockReviewsRepository,
  mockTargetsRepository,
  testReview,
} from '../../../helpers';
import {
  ReviewersService,
  ReviewsService,
  TargetsService,
} from '../../services';

describe('ReviewsService unit tests', () => {
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReviewsService,
        TargetsService,
        ReviewersService,
        {
          provide: reviewsRepositoryProvideToken,
          useValue: mockReviewsRepository,
        },
        {
          provide: reviewersRepositoryProvideToken,
          useValue: mockReviewersRepository,
        },
        {
          provide: targetsRepositoryProvideToken,
          useValue: mockTargetsRepository,
        },
      ],
    }).compile();

    reviewsService = moduleRef.get<ReviewsService>(ReviewsService);
  });

  describe('addReview', () => {
    it('should return review and call addReview function', async () => {
      const dto: ReviewCreationDto = {
        rating: 5,
        targetId: uuidV4(),
        reviewerId: 'reviewerId',
        reviewerFullName: 'Full Name',
        reviewerAvatarUrl: 'http://image.com/reviewerId',
        content: 'this product is amazing',
      };

      jest.spyOn(testReview, 'save').mockResolvedValue(testReview);

      const review = await firstValueFrom(reviewsService.addReview(dto));

      expect(review).toBe(testReview);
      expect(review.targetId).toBe(testReview.targetId);
      expect(review.reviewerId).toBe(testReview.reviewerId);

      expect(mockTargetsRepository.findByPk).toBeCalled();
      expect(mockTargetsRepository.build).toBeCalled();
      expect(mockReviewersRepository.findByPk).toBeCalled();
      expect(mockReviewersRepository.build).toBeCalled();
      expect(mockReviewsRepository.build).toBeCalled();

      expect(testReview.save).toBeCalled();
    });
  });

  describe('getCountAndRatingForProduct', () => {
    it('should return expected number, rating', async () => {
      const reviews = await firstValueFrom(
        reviewsService.getCountAndRating([uuidV4()]),
      );

      expect(reviews[0].numberOfReviews).toBe(0);
      expect(reviews[0].rating).toBe(0);
    });
  });
});
