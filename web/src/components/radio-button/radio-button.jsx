import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './radio-button.styles.pcss';

const Switch = ({
  label, disabled, value, onChange, className,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(styles.container, className, {
      [styles.disabled]: disabled,
    })}
  >
    <div
      className={cn(styles.radio, className, {
        [styles.checked]: value,
        [styles.disabled]: disabled,
      })}
    >
      <input type="radio" name="radio" />
      <span
        className={cn(styles.circle, className, {
          [styles.checked]: value,
          [styles.disabled]: disabled,
        })}
      />
    </div>
    <label
      htmlFor="radio"
      className={cn(styles.label, className, {
        [styles.disabled]: disabled,
      })}
    >
      {label}
    </label>
  </button>
);

Switch.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Switch.defaultProps = {
  disabled: false,
  value: false,
  className: null,
};

export default memo(Switch);
