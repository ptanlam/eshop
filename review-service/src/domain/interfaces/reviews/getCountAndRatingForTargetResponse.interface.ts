export interface GetCountAndRatingForTargetResponse {
  response: Array<{
    numberOfReviews: number;
    rating: number;
    productId: string;
  }>;
}
