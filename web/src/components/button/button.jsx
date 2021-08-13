import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './button.styles.pcss';

const types = {
  primary: 'primary',
  secondary: 'secondary',
  text: 'text',
};

const sizes = {
  m: 'm',
  s: 's',
};

function Button({
  children, type, size, isLoading, disabled, className, ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        {
          [styles.buttonLoading]: isLoading,
          [styles.disabled]: disabled,
        },
        styles.button,
        styles[type],
        styles[size],
        className,
      )}
      {...props}
    >
      {isLoading
        ? (
          <span
            className={cn({
              [styles.loader]: true,
              [styles.loaderLoading]: isLoading,
            },
            styles[type])}
          />
        )
        : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.values(types)),
  size: PropTypes.oneOf(Object.values(sizes)),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: types.primary,
  size: sizes.m,
  isLoading: false,
  className: null,
  disabled: false,
};

export default React.memo(Button);
