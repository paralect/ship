import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import styles from './textarea.styles.pcss';

const TextArea = ({
  errors, label, placeholder, disabled, className, onChange, name, ...props
}) => {
  const formContext = useFormContext();

  const handleChange = useCallback((values) => {
    if (name) formContext.clearErrors(name);
    if (onChange) onChange(values);
  }, [onChange, name, formContext]);

  const { register, formState } = formContext || {};

  return (
    <label
      htmlFor={name}
      className={cn(styles.label, {
        [styles.error]: errors.length || formState?.errors[name],
      })}
    >
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        className={cn(styles.input, className, {
          [styles.error]: errors.length || formState?.errors[name],
          [styles.disabled]: disabled,
        })}
        onChange={handleChange}
        {...(name && register(name))}
        {...props}
      />
      {(errors.length > 0 || formState?.errors[name]) && (
        <div className={styles.errors}>
          {formState?.errors[name]
            ? [...errors, formState?.errors[name]?.message].join(', ')
            : errors.join(', ')}
        </div>
      )}
    </label>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

TextArea.defaultProps = {
  className: '',
  errors: [],
  disabled: false,
  placeholder: null,
  name: '',
  value: '',
  label: '',
  onChange: () => {},
};

export default memo(TextArea);
