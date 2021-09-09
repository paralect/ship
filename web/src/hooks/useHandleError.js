import useToast from './useToast';

export default function useHandleError() {
  const { toastError } = useToast();

  return (e, setError) => {
    const { errors: { _global, ...errors } } = e.data;

    if (_global) toastError(_global[0]);

    if (setError) {
      Object.keys(errors).forEach((key) => {
        setError(key, { message: errors[key].join(' ') }, { shouldFocus: true });
      });
    }
  };
}
