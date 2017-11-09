import * as api from './user.api';

export const FETCH_USER = 'fetchUser';
export const UPDATE_USER = 'updateUser';

export const fetchUser = () => dispatch =>
  api.fetchUser()
    .then(payload => dispatch({ type: FETCH_USER, payload }));

export const updateUser = ({ username, info }) => dispatch =>
  api.updateUser({ username, info })
    .then(payload => dispatch({
      type: UPDATE_USER, username, info, payload,
    }));
