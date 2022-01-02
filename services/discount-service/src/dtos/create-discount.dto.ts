import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Guard } from '../ultils/guard';
import { ToBoolean } from '../ultils/toBoolean';

export class CreateDiscountDto {
  @IsString()
  vendorId: string;
  @IsString()
  discountName: string;
  @IsString()
  description: string;
  @IsNumber()
  priority: number;
  @IsNumber()
  allowedUses: number;
  @IsNumber()
  modifier: number;
  @IsNumber()
  discountRule: number;
  @IsString()
  @MaxLength(3)
  unit: string;
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
  @ToBoolean()
  @IsBoolean()
  isFlatAmount: boolean;
  @ToBoolean()
  @IsBoolean()
  isActive: boolean;
  @IsArray()
  productId?: string[];

  constructor(
    vendorId: string,
    discountName: string,
    description: string,
    priority: number,
    allowedUses: number,
    modifier: number,
    discountRule: number,
    unit: string,
    startDate: Date,
    endDate: Date,
    isFlatAmount: boolean,
    productId?: string[],
  ) {
    this.vendorId = vendorId;
    this.discountName = discountName;
    this.description = description;
    this.priority = priority;
    this.allowedUses = allowedUses;
    this.modifier = Guard.Against.OutSide100(isFlatAmount, modifier);
    this.discountRule = Guard.Against.FlatValueBusinessLogic(
      isFlatAmount,
      modifier,
      discountRule,
    );
    this.unit = unit;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.isFlatAmount = isFlatAmount;
    this.isActive = false;
    this.productId = productId ? productId : null;
  }
}
