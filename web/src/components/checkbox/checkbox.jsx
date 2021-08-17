import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './checkbox.styles.pcss';

const CheckBox = ({
  text, disabled, value, onChange, className,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn({
      [styles.disabled]: disabled,
    }, styles.container, className)}
  >
    <input
      name={text}
      className={styles.checkbox}
      type="checkbox"
      disabled={disabled}
      checked={value}
      onChange={onChange}
    />
    <label
      htmlFor={text}
      className={styles.label}
    >
      {text}
    </label>
  </button>
);

CheckBox.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

CheckBox.defaultProps = {
  disabled: false,
  value: false,
  className: null,
};

export default memo(CheckBox);
