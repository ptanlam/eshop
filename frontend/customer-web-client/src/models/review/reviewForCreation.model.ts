export interface ReviewForCreation {
  targetId: UniqueId;
  content: string;
  reviewerId: UniqueId;
  reviewerFullName: string;
  reviewerAvatarUrl: string;
  rating: number;
  images?: Array<File>;
}
