import { Observable } from 'rxjs';
import { ManipulationOperator } from '../enums';
import { BasketItem, BasketMetadata } from '../models/basket';
import { ListResponse } from '../models/shared';

export interface IInMemoryBasketService {
  fetchBasket(
    limit: number,
    offset: number
  ): Observable<ListResponse<BasketItem>>;

  fetchNumberOfItems(): Observable<number>;

  fetchMetaData(unit: string): Observable<BasketMetadata>;

  addItem(item: BasketItem): Observable<Array<BasketItem>>;

  removeItem(
    limit: number,
    offset: number,
    productId: UniqueId
  ): Observable<BasketItem>;

  manipulateItemQuantity(
    quantity: number,
    productId: UniqueId,
    operator: ManipulationOperator
  ): Observable<BasketItem>;
}
