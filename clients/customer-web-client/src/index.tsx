import { Auth0Provider } from '@auth0/auth0-react';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import history from './app/history';
import { store } from './app/store';
import {
  IDENTITY_PROVIDER_CLIENT_ID,
  IDENTITY_PROVIDER_DOMAIN,
  IDENTITY_PROVIDER_SCOPE,
} from './configs';
import { ApplicationContext } from './contexts';
import { initializeDependencies } from './helpers';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Auth0Provider
        domain={IDENTITY_PROVIDER_DOMAIN}
        clientId={IDENTITY_PROVIDER_CLIENT_ID}
        redirectUri={window.location.origin}
        scope={IDENTITY_PROVIDER_SCOPE}
      >
        <ApplicationContext.Provider value={initializeDependencies()}>
          <App />
        </ApplicationContext.Provider>
      </Auth0Provider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
