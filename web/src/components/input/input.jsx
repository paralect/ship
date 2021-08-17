import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './input.styles.pcss';

function Input({
  onChange, disabled, placeholder, className, errors, value, label, ...props
}) {
  const handleChange = React.useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <div>
      <label
        htmlFor="input"
        className={cn(styles.label, {
          [styles.error]: errors.length,
        })}
      >
        {label}
        <input
          id="input"
          name="input"
          value={value}
          placeholder={placeholder}
          className={cn(styles.input, className, {
            [styles.error]: errors.length,
            [styles.disabled]: disabled,
          })}
          onChange={handleChange}
          {...props}
        />
      </label>
      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password']),
  errors: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
};

Input.defaultProps = {
  className: '',
  type: 'text',
  errors: [],
  disabled: false,
  placeholder: null,
};

export default React.memo(Input);
