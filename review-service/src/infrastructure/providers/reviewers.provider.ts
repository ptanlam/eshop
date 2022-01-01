import { reviewersRepositoryProvideToken } from '../../constants';
import { Reviewer } from '../../domain/models';

export const reviewersProvider = [
  {
    provide: reviewersRepositoryProvideToken,
    useValue: Reviewer,
  },
];
