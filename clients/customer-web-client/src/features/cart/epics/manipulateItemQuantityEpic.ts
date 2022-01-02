import { filter, map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

export const manipulateItemQuantityEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    filter(cartActions.manipulateItemQuantity.match),
    mergeMap(({ payload }) =>
      basketService
        .manipulateItemQuantity(
          payload.quantity,
          payload.productId,
          payload.operator,
          payload.email,
          payload.accessToken
        )
        .pipe(map((item) => cartActions.manipulateItemQuantityFulfilled(item)))
    )
  );
