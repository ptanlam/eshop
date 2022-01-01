export interface ReturnProductsDiscountsResponse {
  response: Array<{
    productId: string;
    percentage: number;
    modifiedPrice: number;
  }>;
}
