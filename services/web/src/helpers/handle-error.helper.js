import { toast } from 'react-toastify';

export default function handleErrorHelper(e, setError) {
  const { errors: { global, ...errors } } = e.data;

  if (global) toast.error(global);

  if (setError) {
    Object.keys(errors).forEach((key) => {
      const message = errors[key].join(' ');

      setError(key, { message }, { shouldFocus: true });
    });
  }
}
