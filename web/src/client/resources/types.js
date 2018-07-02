// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

import type {
  StateType as ToastStateType,
  ActionType as ToastActionType,
} from './toast/toast.types';
import type {
  StateType as UserStateType,
  ActionType as UserActionType,
} from './user/user.types';

export type StateType = {
  toast: ToastStateType,
  user: UserStateType,
};

export type ReduxInitActionType = { type: '@@INIT' };

export type ActionType = ReduxInitActionType | ToastActionType | UserActionType;

export type ThunkedActionType = (dispatch: Dispatch) => void;

export type DispatchType = ReduxDispatch<ActionType> & (action: ThunkedActionType) => void;

export type StoreType = ReduxStore<StateType, ActionType, DispatchType>;
