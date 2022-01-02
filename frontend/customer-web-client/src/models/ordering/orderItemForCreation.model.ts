import { OrderItem } from './orderItem.model';

export interface OrderItemForCreation
  extends Omit<OrderItem, 'totalPrice' | 'totalPriceUnit' | 'id' | 'product'> {
  vendorId: UniqueId;
  productId: UniqueId;

  // for ui
  productName: string;
}
