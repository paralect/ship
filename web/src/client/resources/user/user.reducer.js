import {
  FETCH_USER,
  UPDATE_USER,
  USER_ERRORS,
} from './user.actions';

const initialState = {
  username: '',
  info: '',
  errors: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...action.payload,
        errors: {},
      };

    case UPDATE_USER:
      return {
        ...state,
        username: action.username || state.username,
        info: action.info || state.info,
      };

    case USER_ERRORS:
      return {
        ...state,
        ...action.data,
        errors: action.errors,
      };

    default:
      return state;
  }
};
