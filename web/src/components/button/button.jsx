import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './button.styles.pcss';

const colors = {
  primary: 'primary',
  success: 'success',
  danger: 'danger',
};

function Button({
  children, color, isLoading, className, ...props
}) {
  return (
    <button
      type="button"
      className={cn({
        [styles.button]: true,
        [styles.buttonLoading]: isLoading,
      }, styles[color], className)}
      {...props}
    >
      {children}
      {isLoading && <span className={styles.loader} />}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(Object.values(colors)),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  color: colors.primary,
  isLoading: false,
  className: null,
};

export default React.memo(Button);
