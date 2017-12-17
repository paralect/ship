// @flow

import { FETCH_USER, UPDATE_USER } from './user.actions';
import type { UserType, ActionType } from './user.types';

const initialState: UserType = {
  _id: '',
  createdOn: new Date(),
  firstName: '',
  lastName: '',
  email: '',
};

export default (state: UserType = initialState, action: ActionType): UserType => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...action.payload,
      };

    case UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
