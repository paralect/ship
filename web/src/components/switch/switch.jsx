import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import InputController from '../input-controller';

import styles from './switch.styles.pcss';

const SwitchComponent = ({
  label, disabled, value, onChange, className, name,
}) => {
  const handleChange = useCallback(() => onChange(!value), [onChange, value]);

  return (
    <button
      type="button"
      onClick={handleChange}
      className={cn(styles.container, className)}
    >
      <label
        htmlFor={name}
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
        <input name={name} type="checkbox" />
        <span
          className={cn(styles.slider, className, {
            [styles.checked]: value,
            [styles.disabled]: disabled,
          })}
        />
      </div>
    </button>
  );
};

const Switch = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <SwitchComponent />
    </InputController>
  ) : <SwitchComponent {...props} />
);

SwitchComponent.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

SwitchComponent.defaultProps = {
  disabled: false,
  value: false,
  className: null,
  onChange: null,
  name: '',
  label: '',
};

Switch.propTypes = {
  name: PropTypes.string,
};

Switch.defaultProps = {
  name: '',
};

export default memo(Switch);
