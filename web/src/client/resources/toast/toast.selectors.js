// @flow

import type { StateType } from 'resources/types';
import type { MessageType } from './toast.types';
import * as fromToast from './toast.reducer';

export const getToasterMessages = (state: StateType, filter: string): Array<MessageType> => {
  return fromToast.getToasterMessages(state.toast, filter);
};
