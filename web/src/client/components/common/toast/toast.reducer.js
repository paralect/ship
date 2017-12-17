// @flow

import { ADD_MESSAGE, REMOVE_MESSAGE } from './toast.actions';
import type { MessageType, StateType, ActionType } from './toast.types';

const defaultState = {
  messages: [],
};

const toast = (state: StateType = defaultState, action: ActionType): StateType => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        messages: [
          ...state.messages,
          {
            ...action.message,
          },
        ],
      };

    case REMOVE_MESSAGE:
      return {
        messages: state.messages.filter((message: MessageType): boolean => {
          return message.id !== action.id;
        }),
      };

    default:
      return state;
  }
};

export const getToasterMessages = (state: StateType, filter: string): Array<MessageType> => {
  return state.messages.filter((message: MessageType): boolean => {
    return filter === 'all' || filter === message.type;
  });
};

export default toast;
