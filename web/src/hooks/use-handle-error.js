import useToast from './use-toast';

export default function useHandleError(isShowAllErrors = false) {
  const { toastError } = useToast();

  return (e, setError) => {
    const { errors: { global, ...errors } } = e.data;

    if (global) toastError(global);

    if (setError) {
      Object.keys(errors).forEach((key) => {
        const message = isShowAllErrors
          ? errors[key].join(' ')
          : errors[key][0];

        setError(key, { message }, { shouldFocus: true });
      });
    }
  };
}
