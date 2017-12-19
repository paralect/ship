// @flow

import type {
  StateType as ToastStateType,
  ActionType as ToastActionType,
} from 'components/common/toast/toast.types';
import type {
  StateType as UserType,
  ActionType as UserActionType,
} from './user/user.types';

export type StateType = {
  toast: ToastStateType,
  user: UserType,
};

export type ReduxInitActionType = { type: '@@INIT' };

export type ActionType = ReduxInitActionType | ToastActionType | UserActionType;
