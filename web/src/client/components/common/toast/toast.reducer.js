import _omit from 'lodash/omit';

import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
} from './toast.actions';

const defaultState = {
  messages: {},
  ids: [],
};

const messageHash = (message) => {
  const title = message.title || '';
  const text = JSON.stringify(message.text);
  return `${message.type}-${title}-${text}-${message.isHTML}`;
};

const uniqMessages = (stateMessages, message) => {
  const newState = {};
  Object.keys(stateMessages).forEach((id) => {
    if (messageHash(stateMessages[id]) !== messageHash(message)) {
      newState[id] = stateMessages[id];
    }
  });

  return newState;
};

const toast = (state = defaultState, action) => {
  let id;
  let messages;
  switch (action.type) {
    case ADD_MESSAGE:
      id = action.message.id;
      messages = uniqMessages(state.messages, action.message);

      return {
        messages: {
          ...messages,
          [id]: action.message,
        },
        ids: [
          ...state.ids.filter(messageId => messages[messageId]),
          id,
        ],
      };

    case REMOVE_MESSAGE:
      return {
        messages: _omit(state.messages, action.id),
        ids: state.ids.filter(messageId => messageId !== action.id),
      };

    default:
      return state;
  }
};

export const getToasterMessages = (state, filter) => {
  return state.ids
    .map(id => state.messages[id])
    .filter((message) => {
      return filter === 'all' || filter === message.type;
    });
};

export default toast;
