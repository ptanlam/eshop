import qs from 'qs';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { ICatalogService } from '../interfaces';
import {
  Category,
  Product,
  ProductDetails,
  ProductSuggestion,
} from '../models/catalog';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';

export class CatalogService extends BaseService implements ICatalogService {
  private readonly _productServiceUrl: string = `${API_GATEWAY_URL}/products`;
  private readonly _categoryServiceUrl: string = `${API_GATEWAY_URL}/categories`;

  fetchCategoryList(): Observable<Array<Category>> {
    return this.getHttpClient<Array<Category>>({
      method: HttpMethod.GET,
      url: this._categoryServiceUrl,
    });
  }

  fetchProductList(
    limit: number,
    offset: number,
    conditions?: Partial<Product>
  ): Observable<ListResponse<Product>> {
    return this.getHttpClient<ListResponse<Product>>({
      method: HttpMethod.GET,
      url: this._productServiceUrl,
      queries: qs.stringify({ ...conditions, limit, offset }),
    });
  }

  fetchProductById(id: string, unit: string): Observable<ProductDetails> {
    return this.getHttpClient<ProductDetails>({
      method: HttpMethod.GET,
      url: `${this._productServiceUrl}/${id}`,
      queries: { unit: unit.toLocaleUpperCase() },
    });
  }

  fetchProductSuggestions(q: string): Observable<ProductSuggestion[]> {
    return this.getHttpClient<ProductSuggestion[]>({
      method: HttpMethod.GET,
      url: `${this._productServiceUrl}/fill`,
      queries: { q },
    });
  }
}
