import { Action } from '@reduxjs/toolkit';
import { combineEpics } from 'redux-observable';
import {
  addItemToBasketEpic,
  fetchBasketEpic,
  fetchBasketMetadataEpic,
  fetchNumberOfItemsInBasketEpic,
  manipulateItemQuantityEpic,
  removeItemFromBasketEpic,
} from '../features/cart/epics';
import { AppEpic, RootState } from './store';

const rootEpic: AppEpic = combineEpics<Action, Action, RootState>(
  fetchBasketEpic,
  fetchNumberOfItemsInBasketEpic,
  fetchBasketMetadataEpic,
  addItemToBasketEpic,
  manipulateItemQuantityEpic,
  removeItemFromBasketEpic
);

export default rootEpic;
