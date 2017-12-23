// @flow

import { combineReducers } from 'redux';

import toast from 'components/common/toast/toast.reducer';
import type { ReducerType as ToastReducerType } from 'components/common/toast/toast.types';

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
