import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from './coupon.controller';

describe('CarsController', () => {
  let controller: CouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponController],
    }).compile();

    controller = module.get<CouponController>(CouponController);
  });
});
