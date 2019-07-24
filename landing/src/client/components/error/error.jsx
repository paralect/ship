import React from 'react';
import PropTypes from 'prop-types';

import { ApiError } from '~/helpers/api';

import styles from './error.styles.pcss';

const defaultMessage = 'Unexpected error occurred';

const formatError = (err) => {
  if (err instanceof ApiError) {
    if (err.serverError) {
      return defaultMessage;
    }

    if (err._status === 400) {
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

const Error = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className={styles.error}>
      {formatError(error)}
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.shape(),
};

Error.defaultProps = {
  error: {},
};

export default Error;
