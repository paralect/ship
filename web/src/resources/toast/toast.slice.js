import { createSlice } from '@reduxjs/toolkit';
import uniqueId from 'lodash/uniqueId';

const symbolsPerSecond = 25;

const initialState = [];

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.push(action.payload.message);
    },
    removeToast: (state, action) => state.filter((message) => message.id !== action.payload.id),
  },
});

const { addToast, removeToast } = toastSlice.actions;

const createToast = (data) => (dispatch) => {
  const id = uniqueId('toast_');
  let duration = (data.text.length / symbolsPerSecond) * 1000;
  if (duration < 3000) duration = 3000;

  dispatch(addToast({
    message: {
      id,
      duration,
      ...data,
    },
  }));

  setTimeout(() => dispatch(removeToast({ id })), duration);
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

export const selectMessages = ({ toast }) => toast;

const toastSelectors = {
  selectMessages,
};

const toastActions = {
  success,
  info,
  error,
  warning,
  removeToast,
};

const toastReducer = toastSlice.reducer;

export {
  toastSelectors,
  toastActions,
  toastReducer,
};
