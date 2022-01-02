import { Discount } from '../discount';
import { Vendor } from '../vendor';

export interface Product {
  id: string;
  name: string;
  briefDescription: string;
  stock: number;
  price: Price;
  slug: string;
  images: Array<Image>;
  vendor: Pick<Vendor, 'id' | 'name' | 'logoUrl' | 'slug'>;
  discount?: Discount;
  review: {
    numberOfReviews: number;
    rating: number;
  };
}
