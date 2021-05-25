import { createSlice } from '@reduxjs/toolkit';

import * as socketService from 'services/socket.service';

import { routes } from 'routes';

import * as api from './user.api';

const initialState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload.user,
    removeUser: () => initialState,
  },
});

const { setUser, removeUser } = userSlice.actions;

const signIn = ({ email, password }) => async (dispatch) => {
  const user = await api.signIn({
    email,
    password,
  });
  dispatch(setUser({ user }));
};

const signUp = ({
  firstName,
  lastName,
  email,
  password,
}) => async () => {
  const { signupToken } = await api.signUp({
    firstName,
    lastName,
    email,
    password,
  });

  return { signupToken };
};

const forgot = ({ email }) => async () => {
  await api.forgot({ email });
};

const reset = ({ password, token }) => async (_dispatch, _getState, ctx) => {
  await api.reset({ password, token });
  ctx.history.push(routes.signIn.path);
};

const signOut = () => async (dispatch) => {
  await api.signOut();
  dispatch(removeUser());
  socketService.disconnect();
};

const getCurrentUser = () => async (dispatch) => {
  const user = await api.getCurrentUser();
  dispatch(setUser({ user }));
};

const updateCurrentUser = (data) => async (dispatch) => {
  const user = await api.updateCurrentUser(data);
  dispatch(setUser({ user }));
};

export const userActions = {
  setUser,
  removeUser,
  signIn,
  signUp,
  forgot,
  reset,
  signOut,
  getCurrentUser,
  updateCurrentUser,
};

export default userSlice.reducer;
