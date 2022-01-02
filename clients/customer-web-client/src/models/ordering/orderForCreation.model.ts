import { Customer } from '../customer';
import { ShippingAddress } from './shippingAddress.model';

export interface OrderForCreation {
  customer: Customer;
  vendorId: UniqueId;
  notes?: string;
  shippingAddress: Omit<ShippingAddress, 'id' | 'customerId'>;

  payment: {
    type: string;
    source?: any;
  };

  items: Array<{
    productId: UniqueId;
    price: number;
    priceUnit: string;
    quantity: number;
  }>;
}
