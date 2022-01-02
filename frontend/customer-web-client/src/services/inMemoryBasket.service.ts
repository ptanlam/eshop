import { Observable, of } from 'rxjs';
import { ManipulationOperator } from '../enums';
import { IInMemoryBasketService } from '../interfaces';
import { BasketItem, BasketMetadata } from '../models/basket';
import { ListResponse } from '../models/shared';

export class InMemoryBasketService implements IInMemoryBasketService {
  private readonly _inMemoryBasketKey = 'eshop_in_memory_basket';

  fetchBasket(
    limit: number,
    offset: number
  ): Observable<ListResponse<BasketItem>> {
    const skip = offset === 0 ? offset : limit * offset;
    const take = limit * (offset + 1);

    const basket = this.getBasketFromLocalStorage();
    const paginationOfBasket = {
      data: basket.slice(skip, take),
      pagination: {
        limit,
        offset,
        total: basket.length,
      },
    };

    return of(paginationOfBasket);
  }

  fetchNumberOfItems(): Observable<number> {
    return of(this.getBasketFromLocalStorage().length);
  }

  fetchMetaData(unit: string): Observable<BasketMetadata> {
    const basket = this.getBasketFromLocalStorage();

    const totalPrice = basket.reduce(
      (prev, { price, quantity }) => prev + price * quantity,
      0
    );

    const totalQuantity = basket.reduce(
      (prev, { quantity }) => prev + quantity,
      0
    );

    return of({
      totalPrice,
      unit: unit.toLocaleUpperCase(),
      totalQuantity,
    });
  }

  addItem(item: BasketItem): Observable<BasketItem[]> {
    const basket = this.getBasketFromLocalStorage();

    const itemIndex = this.getItemIndex(basket, item.productId);
    if (itemIndex >= 0) {
      basket[itemIndex].quantity += item.quantity;
    } else {
      basket.push(item);
    }

    this.save(basket);
    return of([item]);
  }

  removeItem(
    limit: number,
    offset: number,
    productId: UniqueId
  ): Observable<BasketItem> {
    let basket = this.getBasketFromLocalStorage();

    // get the next item and return to fill
    // the removed element in tree
    // increase offset by 1 in order to
    // fetch the first item in next page
    const skip = limit * (offset + 1);
    const indexOfTheNextFirstItem = skip + 1;
    const item = basket.slice(skip, indexOfTheNextFirstItem)[0];

    basket = basket.filter((item) => item.productId !== productId);
    this.save(basket);

    return of(item);
  }

  manipulateItemQuantity(
    quantity: number,
    productId: string,
    operator: ManipulationOperator
  ): Observable<BasketItem> {
    const basket = this.getBasketFromLocalStorage();
    const itemIndex = this.getItemIndex(basket, productId);

    switch (operator) {
      case ManipulationOperator.Add:
        basket[itemIndex].quantity += quantity;
        break;

      case ManipulationOperator.Subtract:
        basket[itemIndex].quantity -= quantity;
        break;

      default:
        break;
    }

    this.save(basket);
    return of(basket[itemIndex]);
  }

  private getBasketFromLocalStorage(): BasketItem[] {
    const basketExists = this.checkBasketExists();
    if (!basketExists) return [];

    const stringifiedBasket = localStorage.getItem(this._inMemoryBasketKey);
    const basket = JSON.parse(stringifiedBasket!) as BasketItem[];

    return basket;
  }

  private save(basket: BasketItem[]) {
    localStorage.setItem(this._inMemoryBasketKey, JSON.stringify(basket));
  }

  private checkBasketExists(): boolean {
    return !!localStorage.getItem(this._inMemoryBasketKey);
  }

  private getItemIndex(basket: BasketItem[], productId: UniqueId) {
    return basket.findIndex((i) => i.productId === productId);
  }
}
