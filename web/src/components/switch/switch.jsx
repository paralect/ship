import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './switch.styles.pcss';

const Switch = ({
  label, disabled, value, onChange, className,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(styles.container, className)}
  >
    <label
      htmlFor="switch"
      className={cn(styles.label, className, {
        [styles.disabled]: disabled,
      })}
    >
      {label}
    </label>
    <div
      className={cn(styles.switch, className, {
        [styles.checked]: value,
        [styles.disabled]: disabled,
      })}
    >
      <input name="switch" type="checkbox" />
      <span
        className={cn(styles.slider, className, {
          [styles.checked]: value,
          [styles.disabled]: disabled,
        })}
      />
    </div>
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
