// @flow

import { FETCH_USER, UPDATE_USER } from './user.actions';
import type { StateType, ActionType } from './user.types';

const initialState: StateType = {
  _id: '',
  createdOn: new Date(),
  firstName: '',
  lastName: '',
  email: '',
};

export default (state: StateType = initialState, action: ActionType): StateType => {
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
