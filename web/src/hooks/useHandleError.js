import { useDispatch } from 'react-redux';

import { toastActions } from 'resources/toast/toast.slice';

export default function useHandleError() {
  const dispatch = useDispatch();

  return (e, setError) => {
    const { errors: { _global, ...errors } } = e.data;

    if (_global) dispatch(toastActions.error(_global[0]));

    if (setError) {
      Object.keys(errors).forEach((key) => {
        setError(key, { message: errors[key].join(' ') }, { shouldFocus: true });
      });
    }
  };
}
