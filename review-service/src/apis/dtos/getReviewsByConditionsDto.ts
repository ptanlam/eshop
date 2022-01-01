import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class GetReviewsByConditionsDto {
  @ApiProperty()
  @IsOptional()
  readonly reviewerId?: UniqueId;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  readonly targetId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly limit!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly offset!: number;
}
