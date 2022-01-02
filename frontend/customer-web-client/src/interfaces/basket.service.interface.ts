import { Observable } from 'rxjs';
import { ManipulationOperator } from '../enums';
import { BasketItem, BasketMetadata } from '../models/basket';
import { ListResponse } from '../models/shared';

export interface IBasketService {
  fetchBasket(
    limit: number,
    offset: number,
    email?: string,
    accessToken?: string
  ): Observable<ListResponse<BasketItem>>;

  fetchNumberOfItems(email?: string, accessToken?: string): Observable<number>;

  fetchMetadata(
    unit: string,
    email?: string,
    accessToken?: string
  ): Observable<BasketMetadata>;

  addItem(
    item: BasketItem,
    email?: string,
    accessToken?: string
  ): Observable<Array<BasketItem>>;

  removeItem(
    limit: number,
    offset: number,
    productId: UniqueId,
    email?: string,
    accessToken?: string
  ): Observable<BasketItem>;

  manipulateItemQuantity(
    quantity: number,
    productId: UniqueId,
    operator: ManipulationOperator,
    email?: string,
    accessToken?: string
  ): Observable<BasketItem>;
}
