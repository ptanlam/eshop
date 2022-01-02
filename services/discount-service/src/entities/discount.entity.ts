import {
  BelongsToMany,
  Column,
  DataType,
  IsDate,
  IsDecimal,
  IsInt,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ProductDiscount } from './productDiscount.entity';
import { Product } from './products.entity';

@Table
export class Discount extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  vendorId: string;

  @Column
  discountName: string;

  @Column
  description: string;

  @IsInt
  @Column
  priority: number;

  @IsInt
  @Column
  allowedUses: number;

  @IsDecimal
  @Column
  modifier: number;

  @IsDecimal
  @Column
  discountRule: number;

  @Column(DataType.STRING(3))
  unit: string;

  @IsDate
  @Column
  startDate: Date;

  @IsDate
  @Column
  endDate: Date;

  @Column
  isFlatAmount: boolean;

  @Column
  isActive: boolean;

  @BelongsToMany(() => Product, () => ProductDiscount)
  products: Product[];
}
