import {
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { defaultCurrency } from 'src/constants';
class Price {
  gt: number;
  lt: number;
  constructor() {
    this.gt = null;
    this.lt = null;
  }
}

export class FilterProductDto {
  @IsOptional()
  @IsUUID()
  categoryId: string;
  @IsOptional()
  @IsString()
  name: string;
  @IsInt()
  limit: number;
  @IsInt()
  offset: number;
  @IsOptional()
  price: Price;
  @IsOptional()
  @IsString()
  sort: string;
  @IsOptional()
  @IsString()
  @MaxLength(4)
  order: string;
  @IsOptional()
  @IsUUID()
  brandId: string;
  @IsOptional()
  @IsString()
  @MaxLength(3)
  unit: string = defaultCurrency;
  constructor() {
    this.categoryId = null;
    this.name = null;
    this.limit = null;
    this.offset = null;
    this.price = new Price();
    this.sort = null;
    this.order = null;
    this.brandId = null;
    this.unit = null;
  }
}
