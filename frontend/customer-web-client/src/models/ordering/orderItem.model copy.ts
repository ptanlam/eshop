export interface OrderItem {
  id: number;
  price: number;
  quantity: number;
  priceUnit: string;
  totalPrice: number;

  product: {
    id: UniqueId;
    name: string;
    imageUrl: string;
  };
}
