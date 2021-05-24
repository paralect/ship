import { configureStore } from '@reduxjs/toolkit';

import history from 'services/history.service';

import user from './user/user.slice';
import toast from './toast/toast.slice';

export default configureStore({
  reducer: {
    user,
    toast,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: { extraArgument: { history } },
  }),
});
