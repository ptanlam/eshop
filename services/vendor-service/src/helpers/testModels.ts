import { vendor } from './testData';

export const mockVendorModel = {
  build: jest.fn().mockReturnValue(vendor),
  create: jest.fn().mockResolvedValue(vendor),
  findAll: jest.fn().mockResolvedValue([vendor]),
  findAndCountAll: jest.fn().mockResolvedValue({ rows: [vendor], count: 1 }),
  update: jest.fn().mockResolvedValue([1, [{ ...vendor, isActive: true }]]),
  findByPk: jest.fn(),
};
