import { filter, map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

export const addItemToBasketEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    filter(cartActions.addItem.match),
    mergeMap(({ payload }) =>
      basketService
        .addItem(payload.item, payload.email, payload.accessToken)
        .pipe(
          map((items) =>
            cartActions.addItemFulfilled({
              item: items[0],
              email: payload.email,
              accessToken: payload.accessToken,
            })
          )
        )
    )
  );
