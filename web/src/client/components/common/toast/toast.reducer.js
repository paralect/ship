import { ADD_MESSAGE, REMOVE_MESSAGE } from './toast.actions';

const defaultState = {
  messages: [],
};

const toast = (state = defaultState, action) => {
  let id;
  switch (action.type) {
    case ADD_MESSAGE:
      id = action.message.id;

      return {
        messages: [
          ...state.messages,
          {
            id,
            ...action.message,
          },
        ],
      };

    case REMOVE_MESSAGE:
      return {
        messages: state.messages.filter(message => message.id !== action.id),
      };

    default:
      return state;
  }
};

export const getToasterMessages = (state, filter) => {
  return state.messages.filter((message) => {
    return filter === 'all' || filter === message.type;
  });
};

export default toast;
