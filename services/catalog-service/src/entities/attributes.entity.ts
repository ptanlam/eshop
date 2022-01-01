import { Model } from 'sequelize-typescript';

export class Attributes extends Model {
  id: number;
  productId: string;
  name: string;
  values: string;
}
