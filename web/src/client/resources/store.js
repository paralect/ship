// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import type { BrowserHistory } from 'history/createBrowserHistory';

import reducer from './reducer';
import type { StoreType, StateType } from './types';

const configureStore = (initialState: StateType, history: BrowserHistory): StoreType => {
  const store: StoreType = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history), thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f, // eslint-disable-line
    ),
  );

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
