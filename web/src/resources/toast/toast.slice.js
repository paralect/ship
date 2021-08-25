import { createSlice } from '@reduxjs/toolkit';
import uniqueId from 'lodash/uniqueId';

const initialState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    add: (state, action) => {
      state.messages.push(action.payload.message);
    },
    remove: (state, action) => ({
      messages: state.messages.filter((message) => message.id !== action.payload.id),
    }),
  },
});

const { add, remove } = toastSlice.actions;

const createToast = (data) => (dispatch) => {
  const id = uniqueId('toast_');

  dispatch(add({ message: { id, ...data } }));
  setTimeout(() => dispatch(remove({ id })), 3000);
};

const success = (text) => (dispatch) => {
  dispatch(createToast({ type: 'success', text }));
};

const info = (text) => (dispatch) => {
  dispatch(createToast({ type: 'info', text }));
};

const error = (text) => (dispatch) => {
  dispatch(createToast({ type: 'error', text }));
};

const warning = (text) => (dispatch) => {
  dispatch(createToast({ type: 'warning', text }));
};

export const toastActions = {
  remove,
  success,
  info,
  error,
  warning,
};

export default toastSlice.reducer;
