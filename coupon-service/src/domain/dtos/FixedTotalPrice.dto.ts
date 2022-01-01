import { IsEmail, IsNumber, IsString } from 'class-validator';

export class FixedTotalPriceDto {
  @IsEmail()
  email: string;
  @IsString()
  code!: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  totalPrice!: number;
  @IsString()
  unit!: string;
}
