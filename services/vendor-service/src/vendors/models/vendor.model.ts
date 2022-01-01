import {
  Column,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'Vendors',
  timestamps: true,
  createdAt: 'registeredAt',
})
export class Vendor extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id!: string;

  @Unique
  @Column
  name!: string;

  @IsEmail
  @Unique
  @Column
  email!: string;

  @Unique
  @Column
  hotline!: string;

  @Column
  introduction!: string;

  @Column({ defaultValue: false })
  isActive!: boolean;

  @Column
  ownerId!: string;

  @Column
  slug!: string;
}
