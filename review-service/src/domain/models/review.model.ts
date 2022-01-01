import { IsUUID } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Target } from './product.model';
import { Reviewer } from './reviewer.model';

@Table({
  timestamps: true,
  deletedAt: true,
  tableName: 'Reviews',
})
export class Review extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id!: string;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.DECIMAL(10, 2))
  rating!: number;

  @ForeignKey(() => Target)
  @Column
  targetId!: string;

  @BelongsTo(() => Target)
  target!: Target;

  @ForeignKey(() => Reviewer)
  @Column
  reviewerId!: UniqueId;

  @BelongsTo(() => Reviewer)
  reviewer!: Reviewer;
}
