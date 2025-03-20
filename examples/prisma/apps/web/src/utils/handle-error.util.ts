import { FileRejection } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ONE_MB_IN_BYTES } from 'app-constants';
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

enum ErrorCode {
  FileInvalidType = 'file-invalid-type',
  FileTooLarge = 'file-too-large',
}

export const handleDropzoneError = (fileRejections: FileRejection[]) => {
  fileRejections.forEach((fileRejection) => {
    const { errors } = fileRejection;

    errors.forEach((error) => {
      let { message } = error;

      switch (error.code) {
        case ErrorCode.FileTooLarge: {
          const [maxSizeInBytes] = message.split(' ').slice(-2);

          const maxSizeInMb = Number(maxSizeInBytes) / ONE_MB_IN_BYTES;

          message = `Maximum file size allowed is ${maxSizeInMb} MB.`;
          break;
        }

        case ErrorCode.FileInvalidType: {
          const [fileFormats] = message.split(' ').slice(-1);

          const fileExtensions = fileFormats.split(',').map((format) => `.${format.split('/')[1]}`);

          if (fileExtensions.length === 1) {
            message = `Only ${fileExtensions[0]} file type is allowed.`;
            break;
          }

          message = `Allowed file types are ${fileExtensions.join(', ')}.`;
          break;
        }
        default:
          break;
      }

      showNotification({
        title: 'Error',
        message,
        color: 'red',
      });
    });
  });
};
