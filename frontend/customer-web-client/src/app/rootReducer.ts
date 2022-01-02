import { connectRouter } from 'connected-react-router';
import { combineReducers } from '@reduxjs/toolkit';
import history from './history';
import cartReducer from '../features/cart/cartSlice';
import currencyReducer from '../features/currency/currencySlice';

export default combineReducers({
  router: connectRouter(history),

  cart: cartReducer,
  currency: currencyReducer,
});
