import { BasketItem } from '../models/basket';
import { Product, ProductDetails } from '../models/catalog';
import { getActualPrice } from './getActualPrice';

export function mapProductToBasketItem(
  product: ProductDetails | Product
): BasketItem {
  const { id, name, briefDescription, images, slug, vendor } = product;
  const actualPrice = getActualPrice(product);

  const basketItem: BasketItem = {
    slug,
    name,
    description: briefDescription,
    quantity: 1,
    productId: id,
    unit: actualPrice.unit,
    price: actualPrice.amount,
    image: images[0].url,
    vendorId: vendor.id,
    vendorName: vendor.name,
    vendorLogoUrl: vendor.logoUrl,
  };

  return basketItem;
}
