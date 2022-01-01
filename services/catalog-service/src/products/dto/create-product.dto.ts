import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsString()
  briefDescription: string;
  @IsString()
  detailDescription: string;
  @IsNumber()
  price: number;
  @IsInt()
  stock: number;
  @IsBoolean()
  @IsOptional()
  active: boolean;
  @IsUUID()
  categoryId: string;
  @IsString()
  @MaxLength(3)
  unit: string;
  @IsUUID()
  brandId: string;
  @IsArray()
  attributes: Attribute[];
  constructor(
    name,
    briefDescription,
    detailDescription,
    price,
    stock,
    active,
    categoryId,
    unit,
    brandId,
    attributes,
  ) {
    this.name = name;
    this.briefDescription = briefDescription;
    this.detailDescription = detailDescription;
    this.price = price;
    this.stock = stock;
    this.active = active;
    this.categoryId = categoryId;
    this.unit = unit;
    this.brandId = brandId;
    this.attributes = attributes;
  }
}

class Attribute {
  @IsString()
  name: string;
  @IsString()
  value: string;
}
