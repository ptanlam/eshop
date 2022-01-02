export interface Category {
  id: UniqueId;
  name: string;
  slug: string;
  images: Image[];
  depth: number;
  children: Category[];
}
