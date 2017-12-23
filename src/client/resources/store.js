// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import type { Store } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import reducer from './reducer';
import type { StateType, ActionType } from './types';

// eslint-disable-next-line flowtype/no-weak-types
const configureStore = (initialState: StateType, history: any): Store<StateType, ActionType> => {
  const store: Store<StateType, ActionType> = createStore(
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
