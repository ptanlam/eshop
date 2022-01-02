import { Vendor } from '../vendor';
import { OrderItem } from './orderItem.model';

export interface Order {
  id: UniqueId;
  status: string;
  totalPrice: number;
  priceUnit: string;
  createdAt: string;
  updatedAt?: string;
  items: Array<OrderItem>;
  vendor: Pick<Vendor, 'name' | 'id'>;
}
