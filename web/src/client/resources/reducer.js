// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import type { StateType, ActionType } from './types';

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

const combinedReducer: CombinedReducer<StateType, ActionType> = combineReducers(reducers);

export default combinedReducer;
