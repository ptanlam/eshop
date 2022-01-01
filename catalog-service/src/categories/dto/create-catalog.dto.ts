import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  @IsOptional()
  parentName: string = null;

  @IsNotEmpty()
  name: string;
  constructor() {
    this.name = null;
    this.parentName = null;
  }
}
