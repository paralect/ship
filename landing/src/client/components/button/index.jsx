import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { states } from '~/constants';

import styles from './styles.pcss';

export const sizes = {
  small: 'small',
  medium: 'medium',
};

const Button = ({
  className,
  isLoading,
  action,
  state,
  size,
  children,
}) => {
  return (
    <button
      action={action}
      className={classnames(styles.button, styles[state], styles[size], className, {
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
  state: PropTypes.string,
  size: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  isLoading: false,
  action: 'button',
  children: null,
  state: states.purple,
  size: sizes.medium,
};

export default Button;
