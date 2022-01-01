export interface ProductFilterResponse {
  data: Array<ProductsFilter>;
  pagination: {
    total: number;
  };
  meta: {
    maxPrice: number;
  };
}
export interface ProductsFilter {
  id: string;
  name: string;
  description: string;
  stock: number;
  slug: string;
  price: {
    unit: string;
    amount: number;
  };
  images: Array<{
    id: string;
    ownerId: string;
    url: string;
  }>;
  vendor: {
    id: string;
    name: string;
    logoUrl: string;
  };
  review: {
    numberOfReviews: number;
    rating: number;
  };
}
