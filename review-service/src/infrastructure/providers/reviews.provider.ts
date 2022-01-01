import { reviewsRepositoryProvideToken } from '../../constants';
import { Review } from '../../domain/models';

export const reviewsProvider = [
  {
    provide: reviewsRepositoryProvideToken,
    useValue: Review,
  },
];
