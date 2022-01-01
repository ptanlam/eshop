import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'ExchangeRates',
  timestamps: false,
})
export class ExchangeRate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.STRING(3))
  currency!: string;

  @Column(DataType.DECIMAL(18, 5))
  rate!: number;

  @Column(DataType.DATEONLY())
  date!: string;
}
