import { forwardRef, memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './Checkbox.module.css';

const Checkbox = forwardRef(({
  checked, onChange, name, text, disabled, className,
}, ref) => (
  <button
    type="button"
    onClick={onChange}
    className={cn({
      [styles.disabled]: disabled,
    }, styles.container, className)}
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
      }, styles.checkbox)}
    />
    <label
      htmlFor="checkbox"
      className={styles.label}
    >
      {text}
    </label>
  </button>
));

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: null,
  onChange: null,
  name: null,
  text: '',
  disabled: false,
  className: null,
};

export default memo(Checkbox);
