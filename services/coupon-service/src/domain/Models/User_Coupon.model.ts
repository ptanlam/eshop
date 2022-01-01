import { Model } from 'sequelize';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table
export class UserCoupon extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  couponCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  couponEmail: string;
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  quantity: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isActive: Boolean;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;
}
