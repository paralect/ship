import { FETCH_USER, UPDATE_USER } from './user.actions';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
};

export default (state = initialState, action) => {
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
