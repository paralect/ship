import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';
import configureStore from './resources/store';

import './styles.pcss';

const initialState = {};

const history = createHistory();
const store = configureStore(initialState, history);

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>{routes()}</ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderApp();
  });
}
