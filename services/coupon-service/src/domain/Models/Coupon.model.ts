import { Model } from 'sequelize';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table
export class Coupon extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  code: Number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  couponName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM,
    values: ['percentage', 'cash'],
    allowNull: false,
  })
  couponType: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  modifier: Number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
  })
  amount: Number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unit: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  usage: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  limit: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  pointToAchieve: Number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isActive: Boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted: Boolean;
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
