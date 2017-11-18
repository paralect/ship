import uuidv4 from 'uuid/v4';

export const ADD_MESSAGE = 'add toast message';
export const REMOVE_MESSAGE = 'remove toast message';

const displayTime = 3000;

const hideAfterTimeout = (dispatch, id) => {
  setTimeout(() => {
    dispatch({
      type: REMOVE_MESSAGE,
      id,
    });
  }, displayTime);
};

const addMessage = (dispatch, data) => {
  const id = uuidv4();

  hideAfterTimeout(dispatch, id);

  dispatch({
    type: ADD_MESSAGE,
    message: {
      ...data,
      id,
    },
  });
};

export const addErrorMessage = (title, text, isHTML = false) => (dispatch) => {
  addMessage(dispatch, {
    type: 'error',
    title,
    text,
    isHTML,
  });
};

export const addSuccessMessage = (title, text, isHTML = false) => (dispatch) => {
  addMessage(dispatch, {
    type: 'success',
    title,
    text,
    isHTML,
  });
};

export const removeMessage = id => ({
  type: REMOVE_MESSAGE,
  id,
});
