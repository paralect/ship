import React, { forwardRef, memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './RadioButton.module.css';

const RadioButton = forwardRef(({
  checked, onChange, name, text, disabled, className,
}, ref) => (
  <button
    type="button"
    onClick={onChange}
    className={cn({
      [styles.disabled]: disabled,
    }, styles.container, className)}
  >
    <div
      className={cn({
        [styles.checked]: checked,
        [styles.disabled]: disabled,
      }, styles.radio)}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ref={ref}
        className={styles.input}
      />
      <span
        className={cn({
          [styles.checked]: checked,
          [styles.disabled]: disabled,
        }, styles.circle)}
      />
    </div>
    <label
      htmlFor="radio"
      className={styles.label}
    >
      {text}
    </label>
  </button>
));

RadioButton.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

RadioButton.defaultProps = {
  checked: false,
  onChange: null,
  name: null,
  text: '',
  disabled: false,
  className: null,
};

export default memo(RadioButton);
