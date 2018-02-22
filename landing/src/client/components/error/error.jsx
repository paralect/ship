import React from 'react';

import { ApiError } from '~/helpers/api';

import styles from './styles.pcss';

const defaultMessage = 'Unexpected error occurred';

const formatError = (err) => {
  if (err instanceof ApiError) {
    if (err.serverError) {
      return defaultMessage;
    } else if (err._status === 400) {
      if (err.data && err.data.errors) {
        let errorText = '';

        err.data.errors.forEach((e) => {
          Object.values(e)
            .forEach((errorValue) => {
              errorText += `${errorValue}\n`;
            });
        });

        return errorText;
      }
      return 'Validation Error';
    }
  }

  return defaultMessage;
};

export default({ error } = {}) => {
  if (!error) {
    return null;
  }

  return (
    <div className={styles.error}>
      {formatError(error)}
    </div>
  );
};
