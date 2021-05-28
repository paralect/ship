import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './user/user.slice';
import { toastReducer } from './toast/toast.slice';

export default configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
  },
});
