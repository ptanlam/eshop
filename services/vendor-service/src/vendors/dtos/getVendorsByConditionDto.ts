import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetVendorsByConditionsDto {
  @IsOptional()
  readonly ownerId?: string;

  @IsNumber()
  @IsPositive()
  readonly limit!: number;

  @IsNumber()
  readonly offset!: number;
}
