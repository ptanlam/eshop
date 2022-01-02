import { BasketItem } from '../models/basket';
import { OrderItemForCreation } from '../models/ordering';

export function mapBasketItemToOrderItem(
  item: BasketItem
): OrderItemForCreation {
  const { productId, quantity, price, unit, vendorId, name } = item;

  const orderItem: OrderItemForCreation = {
    productName: name,
    productId,
    quantity,
    price: price,
    priceUnit: unit,
    vendorId,
  };

  return orderItem;
}
