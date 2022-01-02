import { Product } from './product.model';
import { ProductAttribute } from './productAttribute.model';

export interface ProductDetails extends Omit<Product, 'review'> {
  attributes: Array<ProductAttribute>;
  detailDescription: string;
}
