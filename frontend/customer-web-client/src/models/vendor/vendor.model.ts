import { Category } from '../catalog';

export interface Vendor {
  id: UniqueId;
  name: string;
  email: string;
  hotline: string;
  logoUrl: string;
  introduction: string;
  slug: string;
  isActive: boolean;
  ownerId: string;
  updatedAt: string;
  registeredAt: string;

  categories: Array<Pick<Category, 'id' | 'name'>>;
}
