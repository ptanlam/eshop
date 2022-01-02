import { Action, configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { Epic } from 'redux-observable';
import { epicMiddleware } from './epicMiddleware';
import history from './history';
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(
      routerMiddleware(history),
      epicMiddleware
    ),
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppEpic = Epic<Action, Action, RootState>;
