import { v4 as uuidV4 } from 'uuid';
import { VendorCreationDto } from '../vendors/dtos/vendorCreationDto';
import { Vendor } from '../vendors/models/vendor.model';

export const vendorCreationDto: VendorCreationDto = {
  ownerId: uuidV4(),
  name: 'Nike',
  email: 'test@gmail.com',
  hotline: '093920323455',
  introduction: 'Nike is a company',
};

//  @ts-ignore
export const vendor: Vendor = {
  name: 'Nike',
  email: 'test@gmail.com',
  hotline: '093920323455',
  ownerId: uuidV4(),
  isActive: false,

  save: jest.fn(),
  toJSON: jest.fn(),
};
