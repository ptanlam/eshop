import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Review } from './review.model';

@Table({ timestamps: false, tableName: 'Reviewers' })
export class Reviewer extends Model {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  fullName!: string;

  @Column
  avatarUrl!: string;

  @HasMany(() => Review)
  reviews!: Array<Review>;
}
