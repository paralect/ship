import React, { forwardRef, memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './Toggle.module.css';

const Toggle = forwardRef(({
  checked, onChange, name, text, disabled, className,
}, ref) => (
  <button
    type="button"
    onClick={onChange}
    className={cn({
      [styles.disabled]: disabled,
    }, styles.container, className)}
  >
    <label
      htmlFor="checkbox"
      className={styles.label}
    >
      {text}
    </label>
    <div
      className={cn({
        [styles.checked]: checked,
        [styles.disabled]: disabled,
      }, styles.toggle)}
    >
      <input
        type="checkbox"
        name={name}
        ref={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
      />
      <span
        className={cn({
          [styles.checked]: checked,
          [styles.disabled]: disabled,
        }, styles.circle)}
      />
    </div>
  </button>
));

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Toggle.defaultProps = {
  checked: false,
  onChange: null,
  name: null,
  text: '',
  disabled: false,
  className: null,
};

export default memo(Toggle);
