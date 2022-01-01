import { IsEmail, IsString } from 'class-validator';

export class VendorCreationDto {
  @IsString()
  readonly ownerId!: string;

  @IsString()
  readonly introduction!: string;

  @IsString()
  readonly name!: string;

  @IsString()
  readonly hotline!: string;

  @IsEmail()
  readonly email!: string;
}
