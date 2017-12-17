// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import type { Store } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import type { IntitialStateType } from './types';

import routes from './routes';
import configureStore from './resources/store';

import styles from './styles.pcss';
import Layout from './components/layout';

const minLoadingTime: number = 1500;
const now: number = Date.now();

const initialState: IntitialStateType = {
  user: window.user,
};

const history = createHistory();
const store: Store = configureStore(initialState, history);

const Root = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        {routes()}
      </Layout>
    </ConnectedRouter>
  </Provider>
);

const renderApp = (): void => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root'),
  );
};

const hidePoster = (): void => {
  const poster: HTMLElement = document.querySelector('#poster');
  if (!poster) {
    return;
  }
  poster.classList.add(styles.posterHidden);

  setTimeout((): void => {
    poster.classList.add(styles.posterNone);
  }, 600);
};

renderApp();

if (now - window.loadingTime > minLoadingTime) {
  hidePoster();
} else {
  setTimeout(hidePoster, minLoadingTime - (now - window.loadingTime));
}

if (module.hot) {
  module.hot.accept('./routes', (): void => {
    renderApp();
  });
}
