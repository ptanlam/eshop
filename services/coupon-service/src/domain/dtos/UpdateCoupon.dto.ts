import { PartialType } from '@nestjs/swagger';

import { CouponDto } from './Coupon.dto';

export class UpdateCouponDto extends PartialType(CouponDto) {}
