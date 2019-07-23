import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import toast from './toast/toast.reducer';
import user from './user/user.reducer';

const reducers = {
  user,
  toast,
};

const combinedReducer = history => combineReducers({
  router: connectRouter(history),
  ...reducers,
});

export default combinedReducer;
