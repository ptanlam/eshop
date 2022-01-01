export class CreateBasketDto {
  vendorId: string;
  vendorName: string;
  vendorLogoUrl: string;
  productId: string;
  name: string;
  quantity: Number;
  price: Number;
  description: string;
  image: string;
  unit: string;
  slug?: string;
}

export class CreateBasketItemsDto {
  items: [CreateBasketDto];
}
