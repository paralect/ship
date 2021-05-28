import React, { memo, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import {
  CheckIcon, AlertIcon, ErrorIcon, InfoIcon, CloseIcon,
} from 'public/icons';

import styles from './Toast.module.css';

const types = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

const iconsList = {
  success: <CheckIcon />,
  warning: <AlertIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
};

const Toast = ({
  type, message, duration, onClose,
}) => {
  const [close, setClose] = useState(false);

  setTimeout(() => setClose(true), duration - 300);

  return (
    <div
      className={cn({
        [styles.close]: close,
      }, styles.container, styles[type])}
    >
      {iconsList[type]}
      <div className={styles.message}>{message}</div>
      <CloseIcon
        className={styles.closeIcon}
        onClick={() => {
          setClose(true);
          setTimeout(() => {
            onClose();
          }, 300);
        }}
      />
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(Object.keys(types)),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  type: types.success,
  onClose: null,
};

export default memo(Toast);
