import { Product, ProductDetails } from '../models/catalog';

export function getActualPrice(product: Product | ProductDetails) {
  if (!product.discount) return product.price;
  return { amount: product.discount.modifiedPrice, unit: product.price.unit };
}
