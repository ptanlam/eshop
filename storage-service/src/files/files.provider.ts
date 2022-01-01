import { filesRepositoryProvideToken } from '../constants';
import { File } from './entities/file.entity';

export const filesProvider = [
  {
    provide: filesRepositoryProvideToken,
    useValue: File,
  },
];
