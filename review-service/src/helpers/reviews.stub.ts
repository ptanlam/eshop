import { v4 as uuidV4 } from 'uuid';
import { Review } from '../domain/models';

export const testReviews = new Array<Review>();

[...new Array(20)].forEach((_, index) => {
  const targetId = uuidV4();
  const rating = Math.round(Math.random() * 5);

  // @ts-ignore
  const review: Review = {
    content: 'some content',
    rating,
    targetId,
    reviewerId: `reviewerId_${index + 1}`,

    toJSON: jest.fn().mockReturnValue({
      content: 'some content',
      rating,
      targetId,
      reviewerId: `reviewerId_${index + 1}`,
      images: new Array(),
    }),
  };

  testReviews.push(review);
});
