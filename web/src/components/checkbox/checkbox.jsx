import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import InputController from '../input-controller';

import styles from './checkbox.styles.pcss';

const CheckBoxComponent = ({
  label, disabled, value, onChange, className, name,
}) => {
  const handleChange = useCallback(() => onChange(!value), [onChange, value]);

  return (
    <button
      type="button"
      onClick={handleChange}
      className={cn({
        [styles.disabled]: disabled,
      }, styles.container, className)}
    >
      <input
        name={name}
        className={styles.checkbox}
        type="checkbox"
        disabled={disabled}
        onChange={handleChange}
        checked={value}
      />
      <label
        htmlFor={name}
        className={styles.label}
      >
        {label}
      </label>
    </button>
  );
};

const CheckBox = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <CheckBoxComponent />
    </InputController>
  ) : <CheckBoxComponent {...props} />
);

CheckBoxComponent.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

CheckBoxComponent.defaultProps = {
  disabled: false,
  value: false,
  className: null,
  name: '',
  label: '',
  onChange: null,
};

CheckBox.propTypes = {
  name: PropTypes.string,
};

CheckBox.defaultProps = {
  name: '',
};

export default memo(CheckBox);
