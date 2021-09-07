import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import styles from './input.styles.pcss';

const Input = forwardRef(({
  onChange, disabled, placeholder, className, errors, value, label, name, ...props
}, ref) => {
  const formContext = useFormContext();

  const handleChange = useCallback((values) => {
    if (name) formContext.clearErrors(name);
    if (onChange) onChange(values);
  }, [onChange, name, formContext]);

  const { register, formState } = formContext || {};

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(styles.label, {
          [styles.error]: errors.length || formState?.errors[name],
        })}
      >
        {label}
        <input
          id={name}
          ref={ref}
          name={name}
          placeholder={placeholder}
          value={name ? undefined : value}
          className={cn(styles.input, className, {
            [styles.error]: errors.length || formState?.errors[name],
            [styles.disabled]: disabled,
          })}
          onChange={handleChange}
          {...(name && register(name))}
          {...props}
        />
      </label>
      {(errors.length > 0 || formState?.errors[name]) && (
        <div className={styles.errors}>
          {formState?.errors[name]
            ? [...errors, formState?.errors[name]?.message].join(', ')
            : errors.join(', ')}
        </div>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
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
  name: '',
  label: '',
  value: '',
  onChange: () => {},
};

export default React.memo(Input);
