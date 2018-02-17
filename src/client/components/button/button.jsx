import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.pcss';

const Button = ({
  className,
  isLoading,
  action,
  children,
}) => {
  return (
    <button
      action={action}
      className={classnames(styles.button, className, {
        [styles.loading]: isLoading,
      })}
      disabled={isLoading}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  action: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  className: '',
  isLoading: false,
  action: 'button',
  children: null,
};

export default Button;
