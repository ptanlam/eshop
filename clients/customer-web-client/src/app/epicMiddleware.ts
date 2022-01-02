import { createEpicMiddleware } from 'redux-observable';
import { Action } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BasketService, InMemoryBasketService } from '../services';

const inMemoryBasketService = new InMemoryBasketService();
const basketService = new BasketService(inMemoryBasketService);

export const epicMiddleware = createEpicMiddleware<Action, Action, RootState>({
  dependencies: { basketService },
});
