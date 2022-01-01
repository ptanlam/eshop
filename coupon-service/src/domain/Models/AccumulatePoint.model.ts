import { Model } from 'sequelize';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table
export class AccumulatePoint extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  basePoint: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId: string;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
  })
  totalPrice: Number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unit: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  computePoint: Number;

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
