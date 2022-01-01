import { vendor } from './testData';
import { of } from 'rxjs';

export const mockMessagingService = {
  upload: jest.fn(),
};
export const mockCatalogService = {
  getCategoryListForVendor: jest.fn().mockReturnValue(of([])),
};

export const mockFilesServiceService = {
  getAllForOwner: jest.fn().mockReturnValue(of({})),
};

export const mockVendorsService = {
  register: jest.fn().mockResolvedValue(vendor),
  getById: jest.fn().mockResolvedValue(vendor),
  getByOwner: jest.fn().mockResolvedValue([vendor]),
  find: jest.fn(),
  getAll: jest
    .fn()
    .mockResolvedValue({ data: [vendor], pagination: { total: 1 } }),
  activate: jest.fn().mockResolvedValue([1, [{ ...vendor, isActive: true }]]),
};
