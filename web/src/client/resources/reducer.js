import { combineReducers } from 'redux';

import toast, * as fromToast from 'components/common/toast/toast.reducer';
import user from './user/user.reducer';

export default combineReducers({
  user,
  toast,
});

export const getToasterMessages = (state, filter) => {
  return fromToast.getToasterMessages(state.toast, filter);
};
