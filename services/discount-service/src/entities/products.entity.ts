import {
  Table,
  Model,
  BelongsToMany,
  Column,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript';
import { Discount } from './discount.entity';
import { ProductDiscount } from './productDiscount.entity';
@Table
export class Product extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @BelongsToMany(() => Discount, () => ProductDiscount)
  discount: Discount[];
}
