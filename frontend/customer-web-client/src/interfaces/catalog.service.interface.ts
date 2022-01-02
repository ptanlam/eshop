import { Observable } from 'rxjs';
import {
  Category,
  Product,
  ProductDetails,
  ProductSuggestion,
} from '../models/catalog';
import { ListResponse } from '../models/shared';

export interface ICatalogService {
  fetchCategoryList(): Observable<Array<Category>>;

  fetchProductList(
    limit: number,
    offset: number,
    conditions?: Partial<ProductDetails>
  ): Observable<ListResponse<Product>>;

  fetchProductById(id: UniqueId, unit: string): Observable<ProductDetails>;

  fetchProductSuggestions(q: string): Observable<Array<ProductSuggestion>>;
}
