export interface BasketItem {
  name: string;
  unit: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  productId: UniqueId;
  description: string;
  vendorId: UniqueId;
  vendorName: string;
  vendorLogoUrl: string;
}
