import { Discount } from '../entities/discount.entity';

export const discountsProvider = [
  {
    provide: 'DISCOUNT_REPOSITORY',
    useValue: Discount,
  },
];
