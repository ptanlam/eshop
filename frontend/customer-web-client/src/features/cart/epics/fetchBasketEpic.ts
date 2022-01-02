import { filter, map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

export const fetchBasketEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    filter(cartActions.fetchBasket.match),
    mergeMap(({ payload }) =>
      basketService
        .fetchBasket(
          payload.limit,
          payload.offset,
          payload.email,
          payload.accessToken
        )
        .pipe(map((response) => cartActions.fetchBasketFulfilled(response)))
    )
  );
