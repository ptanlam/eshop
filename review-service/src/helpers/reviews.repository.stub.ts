import { testReview } from './review.stub';
import { testReviews } from './reviews.stub';

export const mockReviewsRepository = {
  findAndCountAll: jest
    .fn()
    .mockResolvedValue({ rows: testReviews, count: testReviews.length }),
  findByPk: jest.fn().mockResolvedValue(testReview),
  build: jest.fn().mockReturnValue(testReview),
  count: jest.fn().mockResolvedValue(testReviews.length),
};
