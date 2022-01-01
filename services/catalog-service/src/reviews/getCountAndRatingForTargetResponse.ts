export interface getCountAndRatingForTargetResponse {
  response: Array<{
    numberOfReviews: number;
    rating: number;
    productId: string;
  }>;
}
