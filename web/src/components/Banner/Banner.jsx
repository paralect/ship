import React, { useState, memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import {
  CheckIcon, AlertIcon, ErrorIcon, InfoIcon, CloseIcon,
} from 'public/icons';

import Button from 'components/Button';

import styles from './Banner.module.css';

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

const Banner = ({
  type, text, buttonText, onButtonClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn({
      [styles.isOpen]: isOpen,
    }, styles.banner, styles[type])}
    >
      {iconsList[type]}
      <div className={styles.text}>{text}</div>
      <div className={styles.controls}>
        {buttonText && (
          <Button
            onClick={onButtonClick}
            className={cn(styles.button, styles[type])}
          >
            <span className={styles.buttonText}>{buttonText}</span>
          </Button>
        )}
        <CloseIcon onClick={() => setIsOpen(false)} className={styles.closeIcon} />
      </div>
    </div>
  );
};

Banner.propTypes = {
  type: PropTypes.oneOf(Object.keys(types)),
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

Banner.defaultProps = {
  type: types.success,
  buttonText: null,
  onButtonClick: null,
};

export default memo(Banner);
