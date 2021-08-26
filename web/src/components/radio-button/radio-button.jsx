import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import InputController from '../input-controller';

import styles from './radio-button.styles.pcss';

const RadioButtonComponent = ({
  label, disabled, value, onChange, className, name,
}) => {
  const handleChange = useCallback(() => onChange(!value), [onChange, value]);

  return (
    <button
      type="button"
      onClick={handleChange}
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
        <input
          type="radio"
          name={name}
          disabled={disabled}
          onChange={handleChange}
          checked={value}
        />
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
};

const RadioButton = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <RadioButtonComponent />
    </InputController>
  ) : <RadioButtonComponent {...props} />
);

RadioButtonComponent.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

RadioButtonComponent.defaultProps = {
  disabled: false,
  value: false,
  className: null,
  onChange: null,
  label: '',
  name: '',
};

RadioButton.propTypes = {
  name: PropTypes.string,
};

RadioButton.defaultProps = {
  name: '',
};

export default memo(RadioButton);
