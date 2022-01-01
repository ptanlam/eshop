import { Model } from 'sequelize';

export class Basket extends Model {
  id: string;
  vendorId: string;
  email: string;
  vendorName: string;
  vendorLogoUrl: string;
  productId: string;
  name: string;
  quantity: Number;
  price: Number;
  description: string;
  image: string;
  unit: string;
  slug: string;
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
