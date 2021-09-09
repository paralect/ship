import { useDispatch } from 'react-redux';

import { toastActions } from 'resources/toast/toast.slice';

export default function useToast() {
  const dispatch = useDispatch();

  const toastSuccess = (text) => {
    dispatch(toastActions.success(text));
  };

  const toastInfo = (text) => {
    dispatch(toastActions.info(text));
  };

  const toastError = (text) => {
    dispatch(toastActions.error(text));
  };

  const toastWarning = (text) => {
    dispatch(toastActions.warning(text));
  };

  return {
    toastSuccess, toastInfo, toastError, toastWarning,
  };
}
