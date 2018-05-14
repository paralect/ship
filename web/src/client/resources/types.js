// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

import type {
  StateType as ToastStateType,
  ActionType as ToastActionType,
} from './toast/toast.types';
import type { StateType as UserType, ActionType as UserActionType } from './user/user.types';

export type StateType = {
  toast: ToastStateType,
  user: UserType,
};

export type ReduxInitActionType = { type: '@@INIT' };

export type ActionType = ReduxInitActionType | ToastActionType | UserActionType;

export type StoreType = ReduxStore<StateType, ActionType>;

export type ThunkedActionType = (dispatch: Dispatch) => void;

export type DispatchType = ReduxDispatch<ActionType> & (action: ThunkedActionType) => void;
