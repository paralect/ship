// @flow

import uuidv4 from 'uuid/v4';

import type { ShortMessageType, ActionType } from './toast.types';

export const ADD_MESSAGE: string = 'add toast message';
export const REMOVE_MESSAGE: string = 'remove toast message';

const displayTime = 3000;

type DispatchFnType = (obj: ActionType | Promise<ActionType>) => void;

type VoidFnType = (dispatch: DispatchFnType) => void;

type RemoveMessageType = {
  type: string,
  id: string,
};

const hideAfterTimeout = (dispatch: DispatchFnType, id: string) => {
  setTimeout(() => {
    dispatch({
      type: REMOVE_MESSAGE,
      id,
    });
  }, displayTime);
};

const addMessage = (dispatch: DispatchFnType, data: ShortMessageType) => {
  const id: string = uuidv4();

  hideAfterTimeout(dispatch, id);

  dispatch({
    type: ADD_MESSAGE,
    message: {
      ...data,
      id,
    },
  });
};

export const addErrorMessage = (
  title: string,
  text: string,
  isHTML: boolean = false,
): VoidFnType => (dispatch: DispatchFnType) => {
  addMessage(dispatch, {
    type: 'error',
    title,
    text,
    isHTML,
  });
};

export const addSuccessMessage = (
  title: string,
  text: string,
  isHTML: boolean = false,
): VoidFnType => (dispatch: DispatchFnType) => {
  addMessage(dispatch, {
    type: 'success',
    title,
    text,
    isHTML,
  });
};

export const removeMessage = (id: string): RemoveMessageType => ({
  type: REMOVE_MESSAGE,
  id,
});
