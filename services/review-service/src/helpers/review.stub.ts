import { v4 as uuidV4 } from 'uuid';
import { Review } from '../domain/models';

// @ts-ignore
export const testReview: Review = {
  content: 'some content',
  rating: Math.round(Math.random() * 5),
  targetId: uuidV4(),
  reviewerId: `reviewerId`,

  save: jest.fn(),
};
