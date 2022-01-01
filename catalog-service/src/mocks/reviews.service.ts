import { productStub } from '../stubs/products.stub';
import { reviewStub } from '../stubs/reviews.stub';

const ReviewsService = jest.fn().mockReturnValue({
  getReviewsForMultipleProduct: jest
    .fn()
    .mockReturnValue([productStub(), reviewStub()]),
});

export default ReviewsService();
