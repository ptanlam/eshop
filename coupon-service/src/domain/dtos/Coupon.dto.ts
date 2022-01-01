import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export enum CouponType {
  PERCENTAGE = 'percentage',
  CASH = 'cash',
}

export class CouponDto {
  @IsEnum(CouponType, {
    message: 'Coupon Type must be either percentage or cash',
  })
  couponType: CouponType;
  couponName: string;
  description: string;
  @IsInt()
  modifier?: number;
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;
  @IsString()
  unit?: string;
  @IsInt()
  usage: number;
  @IsInt()
  limit?: number;
  @IsInt()
  pointToAchieve: number;
  @IsString()
  @IsOptional()
  isUnlimited: string;
  startTime: string | Date;
  endTime: string | Date;
}

export class ManyCouponDto {
  coupons: [CouponDto];
}
