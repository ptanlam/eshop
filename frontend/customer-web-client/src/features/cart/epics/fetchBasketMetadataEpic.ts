import { filter, map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

export const fetchBasketMetadataEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    filter(cartActions.fetchMetadata.match),
    mergeMap(({ payload }) =>
      basketService
        .fetchMetadata(payload.unit, payload.email, payload.accessToken)
        .pipe(map((response) => cartActions.fetchMetadataFulfilled(response)))
    )
  );
