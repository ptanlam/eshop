import { filter, map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

export const removeItemFromBasketEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    filter(cartActions.removeItem.match),
    mergeMap(({ payload }) =>
      basketService
        .removeItem(
          payload.limit,
          payload.offset,
          payload.productId,
          payload.email,
          payload.accessToken
        )
        .pipe(
          map((item) =>
            cartActions.removeItemFulfilled({
              email: payload.email,
              accessToken: payload.accessToken,
              item,
            })
          )
        )
    )
  );
