// @flow

import { combineReducers } from 'redux';

import toast from './toast/toast.reducer';
import type { ReducerType as ToastReducerType } from './toast/toast.types';

import user from './user/user.reducer';
import type { ReducerType as UserReducerType } from './user/user.types';

type ReducersType = {
  user: UserReducerType,
  toast: ToastReducerType,
};

const reducers: ReducersType = {
  user,
  toast,
};

export default combineReducers(reducers);
