import { FETCH_USER, UPDATE_USER } from './user.actions';

const initialState = {
  username: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;

    case UPDATE_USER:
      return {
        ...state,
        username: action.username || state.username,
        info: action.info || state.info,
      };

    default:
      return state;
  }
};
