import { of, mergeMap, iif, Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod, ManipulationOperator } from '../enums';
import { IBasketService, IInMemoryBasketService } from '../interfaces';
import { BasketItem, BasketMetadata } from '../models/basket';
import { ListResponse } from '../models/shared';
import { BaseService } from './base.service';

export class BasketService extends BaseService implements IBasketService {
  private readonly _serviceUrl: string = `${API_GATEWAY_URL}/baskets`;

  constructor(private readonly _inMemoryBasketService: IInMemoryBasketService) {
    super();
  }

  fetchBasket(
    limit: number,
    offset: number,
    email?: string,
    accessToken?: string
  ): Observable<ListResponse<BasketItem>> {
    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<ListResponse<BasketItem>>(
            {
              method: HttpMethod.GET,
              url: `${this._serviceUrl}/pagination`,
              queries: { limit, offset, email: email! },
            },
            accessToken!
          ),
          this._inMemoryBasketService.fetchBasket(limit, offset)
        )
      )
    );
  }

  fetchNumberOfItems(email?: string, accessToken?: string): Observable<number> {
    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<number>(
            {
              method: HttpMethod.GET,
              url: `${this._serviceUrl}/number`,
              queries: { email },
            },
            accessToken!
          ),
          this._inMemoryBasketService.fetchNumberOfItems()
        )
      )
    );
  }

  fetchMetadata(
    unit: string,
    email?: string,
    accessToken?: string
  ): Observable<BasketMetadata> {
    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<BasketMetadata>(
            {
              method: HttpMethod.GET,
              url: `${this._serviceUrl}/total`,
              queries: { email },
            },
            accessToken!
          ),
          this._inMemoryBasketService.fetchMetaData(unit)
        )
      )
    );
  }

  addItem(
    item: BasketItem,
    email?: string,
    accessToken?: string
  ): Observable<Array<BasketItem>> {
    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<Array<BasketItem>>(
            {
              method: HttpMethod.POST,
              url: this._serviceUrl,
              queries: { email },
              body: {
                email,
                items: [item],
              },
            },
            accessToken!
          ),
          this._inMemoryBasketService.addItem(item)
        )
      )
    );
  }

  removeItem(
    limit: number,
    offset: number,
    productId: string,
    email?: string,
    accessToken?: string
  ): Observable<BasketItem> {
    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<BasketItem>(
            {
              method: HttpMethod.DELETE,
              url: `${this._serviceUrl}/product/remove`,
              queries: { productId, email: email!, limit, offset },
            },
            accessToken!
          ),
          this._inMemoryBasketService.removeItem(limit, offset, productId)
        )
      )
    );
  }

  manipulateItemQuantity(
    quantity: number,
    productId: string,
    operator: ManipulationOperator,
    email?: string,
    accessToken?: string
  ): Observable<BasketItem> {
    const source =
      operator === ManipulationOperator.Add ? 'increase' : 'decrease';

    return of(true).pipe(
      mergeMap(() =>
        iif(
          () => !!email && !!accessToken,
          this.getAuthenticatedHttpClient<BasketItem>(
            {
              method: HttpMethod.PATCH,
              url: `${this._serviceUrl}/product/${source}`,
              queries: { productId, email: email! },
            },
            accessToken!
          ),
          this._inMemoryBasketService.manipulateItemQuantity(
            quantity,
            productId,
            operator
          )
        )
      )
    );
  }
}
