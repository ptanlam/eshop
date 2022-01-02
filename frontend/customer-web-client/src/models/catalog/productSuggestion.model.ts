import { Product } from './product.model';

export interface ProductSuggestion {
  category: string;
  products: Array<Pick<Product, 'id' | 'name'>>;
}
