export interface ShippingAddress {
  id: number;
  customerId: UniqueId;
  country: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  details: string;
}
