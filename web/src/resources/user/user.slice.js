import { createSlice } from '@reduxjs/toolkit';

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

const signUp = (data) => async () => {
  const { signupToken } = await api.signUp(data);
  return { signupToken };
};

const signIn = (data) => async (dispatch) => {
  const user = await api.signIn(data);
  dispatch(setUser({ user }));
};

const signOut = () => async (dispatch) => {
  await api.signOut();
  await dispatch(removeUser());
};

const getCurrent = () => async (dispatch) => {
  const user = await api.getCurrent();
  dispatch(setUser({ user }));
};

const userActions = {
  setUser,
  removeUser,
  signUp,
  signIn,
  signOut,
  getCurrent,
};

const selectUser = ({ user }) => user;

const userSelectors = {
  selectUser,
};

const userReducer = userSlice.reducer;

export {
  userSelectors,
  userActions,
  userReducer,
};
