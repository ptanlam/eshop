import { Customer } from '../customer';
import { Reaction } from '../reaction';

export interface Review {
  id: UniqueId;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  reviewer: Pick<Customer, 'fullName' | 'avatarUrl'>;

  images: Array<Image>;
  reactions: Array<Reaction>;
}
