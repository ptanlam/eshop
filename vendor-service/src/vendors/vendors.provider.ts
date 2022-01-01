import { vendorsRepositoryProvideToken } from '../constants';
import { Vendor } from './models/vendor.model';

export const vendorsProvider = [
  {
    provide: vendorsRepositoryProvideToken,
    useValue: Vendor,
  },
];
