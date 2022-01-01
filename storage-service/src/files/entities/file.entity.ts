import {
  Column,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class File extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id!: string;

  @Column
  ownerId!: string;

  @Column(DataType.TEXT)
  url!: string;
}
