import { OrderJourney } from './orderJourney.model';
import { Order } from './order.model';
import { ShippingAddress } from './shippingAddress.model';
import { Customer } from '../customer';
import { Receipt } from '../payment';

export interface OrderDetails extends Order {
  journeys: Array<OrderJourney>;
  notes: string;
  customer: Omit<Customer, 'avatarUrl'>;
  shippingAddress: ShippingAddress;
  receipt: Pick<Receipt, 'type' | 'amount' | 'currency' | 'paid'>;
  canBeManipulated: boolean;
}
