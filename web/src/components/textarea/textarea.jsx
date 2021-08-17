import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './textarea.styles.pcss';

const TextArea = ({
  errors, label, placeholder, disabled, className, onChange, value,
}) => (
  <label
    htmlFor="textarea"
    className={cn(styles.label, {
      [styles.error]: errors.length,
    })}
  >
    {label}
    <textarea
      id="textarea"
      name="textarea"
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      className={cn(styles.input, className, {
        [styles.error]: errors.length,
        [styles.disabled]: disabled,
      })}
      onChange={onChange}
    />
    {errors.length > 0 && (
      <div className={styles.errors}>
        {errors.join(', ')}
      </div>
    )}
  </label>
);

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
};

TextArea.defaultProps = {
  className: '',
  errors: [],
  disabled: false,
  placeholder: null,
};

export default TextArea;
