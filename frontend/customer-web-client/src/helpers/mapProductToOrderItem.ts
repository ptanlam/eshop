import { ProductDetails } from '../models/catalog';
import { OrderItemForCreation } from '../models/ordering';
import { getActualPrice } from './getActualPrice';

export function mapProductToOrderItem(
  product: ProductDetails
): OrderItemForCreation {
  const { id, vendor, name } = product;
  const actualPrice = getActualPrice(product);

  const orderItem: OrderItemForCreation = {
    productName: name,
    productId: id,
    quantity: 1,
    price: actualPrice.amount,
    priceUnit: actualPrice.unit,
    vendorId: vendor.id,
  };

  return orderItem;
}
