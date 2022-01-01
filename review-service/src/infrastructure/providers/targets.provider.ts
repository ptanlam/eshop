import { targetsRepositoryProvideToken } from '../../constants';
import { Target } from '../../domain/models';

export const targetsProvider = [
  {
    provide: targetsRepositoryProvideToken,
    useValue: Target,
  },
];
