import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class AccumulatePointDto {
  @IsEmail()
  email!: string;
  @IsNumber()
  @IsOptional()
  basePoint: number;
  @IsString()
  orderId!: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  totalPrice!: number;
  @IsString()
  unit!: string;
}
