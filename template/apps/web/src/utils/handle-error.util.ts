import { showNotification } from '@mantine/notifications';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ApiError } from 'types';

type ValidationErrors = {
  [name: string]: string[] | string;
};

interface ErrorData {
  errors?: ValidationErrors;
}

export const handleApiError = <TFieldValues extends FieldValues>(
  e: ApiError,
  setError?: UseFormSetError<TFieldValues>,
) => {
  const data = e.data as ErrorData;

  if (!data?.errors) return;

  const { global, ...errors } = data.errors;

  if (global) {
    showNotification({
      title: 'Error',
      message: global,
      color: 'red',
    });
  }

  if (setError) {
    Object.keys(errors).forEach((key) => {
      let message = errors[key];

      if (Array.isArray(message)) {
        message = message.join(' ');
      }

      setError(key as Path<TFieldValues>, { message }, { shouldFocus: true });
    });
  }
};
