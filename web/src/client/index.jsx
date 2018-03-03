import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';
import configureStore from './resources/store';

import styles from './styles.pcss';
import Layout from './components/layout';

const minLoadingTime = 1500;
const now = Date.now();

const initialState = {
  user: window.user,
};

const history = createHistory();
const store = configureStore(initialState, history);

const Root = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        {routes()}
      </Layout>
    </ConnectedRouter>
  </Provider>
);

const renderApp = () => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root'),
  );
};

const hidePoster = () => {
  const poster = document.querySelector('#poster');
  if (!poster) {
    return;
  }
  poster.classList.add(styles.posterHidden);

  setTimeout(() => {
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
  module.hot.accept('./routes', () => {
    renderApp();
  });
}
