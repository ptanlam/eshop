import { testReviewer } from './reviewer.stub';

export const mockReviewersRepository = {
  findOrBuild: jest.fn(),
  findByPk: jest.fn().mockResolvedValue(testReviewer),
  build: jest.fn().mockReturnValue(testReviewer),
};
