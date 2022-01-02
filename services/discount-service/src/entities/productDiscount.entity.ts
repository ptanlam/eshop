import {
  Column,
  ForeignKey,
  IsDecimal,
  Model,
  Table,
} from 'sequelize-typescript';
import { Discount } from './discount.entity';
import { Product } from './products.entity';

@Table
export class ProductDiscount extends Model {
  @ForeignKey(() => Product)
  productId: string;

  @ForeignKey(() => Discount)
  discountId: string;

  @IsDecimal
  @Column
  adjustmentAmount: number;
}
