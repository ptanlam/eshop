import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Review } from './review.model';

@Table({ timestamps: false, tableName: 'Targets' })
export class Target extends Model {
  @PrimaryKey
  @Column
  id!: string;

  @HasMany(() => Review)
  reviews!: Array<Review>;

  getAvgRating() {
    return (
      this.reviews.reduce((prev, curr) => prev + curr.rating, 0) /
      this.reviews.length
    );
  }
}
