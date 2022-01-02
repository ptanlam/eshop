import { Image } from "..";

export interface Category {
  id: string;
  name: string;
  slug: string;
  depth: number;
  children?: ChilrenCategory[];
  images: Image[];
}

export interface ChilrenCategory extends Category {
  parentId: string;
  children?: ChilrenCategory[];
  images: Image[];
}
