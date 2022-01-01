import { of } from 'rxjs';
import { testReview, testReviews } from '.';
import { GetReviewsByConditionsDto, ReviewCreationDto } from '../apis/dtos';

export const mockReviewsService = {
  getReviewsByConditions: jest.fn((_: GetReviewsByConditionsDto) =>
    of({ data: testReviews, pagination: { total: testReviews.length } }),
  ),

  addReview: jest.fn((_: ReviewCreationDto) => of(testReview)),

  getCountAndRating: jest.fn((_: string) =>
    of([
      {
        numberOfReviews: testReviews.length,
        rating:
          testReviews.reduce((prev, curr) => prev + curr.rating, 0) /
          testReviews.length,
      },
    ]),
  ),
};
