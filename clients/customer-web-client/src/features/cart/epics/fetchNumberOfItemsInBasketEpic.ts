import { PayloadAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs';
import { AppEpic } from '../../../app/store';
import { cartActions } from '../cartSlice';
import { CartEpicProps } from './cartEpicProps';

type Request = PayloadAction<{ email?: string; accessToken?: string }>;

export const fetchNumberOfItemsInBasketEpic: AppEpic = (
  action$,
  _,
  { basketService }: CartEpicProps
) =>
  action$.pipe(
    ofType(
      cartActions.fetchNumberOfItems.type,
      cartActions.addItemFulfilled.type,
      cartActions.removeItemFulfilled.type
    ),
    map((action) => action as Request),
    mergeMap(({ payload }) =>
      basketService
        .fetchNumberOfItems(payload.email, payload.accessToken)
        .pipe(
          map((response) => cartActions.fetchNumberOfItemsFulfilled(response))
        )
    )
  );
