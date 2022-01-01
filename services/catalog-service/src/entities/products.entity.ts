import { Model } from 'sequelize-typescript';

export class Products extends Model {
  id: string;
  groupId: number;
  name: string;
  briefDescription: string;
  detailDescription: string;
  price: number;
  stock: number;
  active: boolean;
  unit: string;
  slug: string;
  brandId: string;
}
