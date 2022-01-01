import { Model } from 'sequelize-typescript';

export class Categories extends Model {
  id: string;
  name: string;
  parenId: string;
  slug: string;
  depth: number;
}
