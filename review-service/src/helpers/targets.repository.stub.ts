import { testTarget } from './product.stub';

export const mockTargetsRepository = {
  findOrBuild: jest.fn(),
  findByPk: jest.fn().mockResolvedValue(testTarget),
  build: jest.fn().mockReturnValue(testTarget),
};
