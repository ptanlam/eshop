import { Target } from '../domain/models';
import { v4 as uuidV4 } from 'uuid';

// @ts-ignore
export const testTarget: Target = {
  id: uuidV4(),

  getAvgRating: jest.fn(),
};
