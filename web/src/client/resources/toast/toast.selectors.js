import * as fromToast from './toast.reducer';

export const getToasterMessages = (state, filter) => {
  return fromToast.getToasterMessages(state.toast, filter);
};
