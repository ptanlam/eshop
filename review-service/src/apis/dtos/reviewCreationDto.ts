import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, IsUUID, Max, Min } from 'class-validator';

export class ReviewCreationDto {
  @ApiProperty()
  @IsString()
  readonly content!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating!: number;

  @ApiProperty()
  @IsString()
  readonly reviewerId!: UniqueId;

  @ApiProperty()
  @IsString()
  readonly reviewerFullName!: string;

  @ApiProperty()
  @IsUrl()
  readonly reviewerAvatarUrl!: string;

  @ApiProperty()
  @IsUUID(4)
  readonly targetId!: string;
}
