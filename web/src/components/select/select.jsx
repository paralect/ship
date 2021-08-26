import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import { getCustomStyle } from './helpers';

import InputController from '../input-controller';

import styles from './select.styles.pcss';

const SelectComponent = ({
  options, label, disabled, error, placeholder, className, onChange, value, name,
}) => (
  <label
    htmlFor={name}
    className={cn(styles.label, className)}
  >
    {label && (
    <span
      className={
            cn({
              [styles.error]: error,
            }, styles.title, className)
          }
    >
      {label}
    </span>
    )}
    <ReactSelect
      name={name}
      className={cn(styles.select, {
        [styles.error]: error,
      })}
      blurInputOnSelect
      classNamePrefix="select"
      hideSelectedOptions={false}
      styles={getCustomStyle(error)}
      isFocused={false}
      isDisabled={disabled}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <span className={styles.error}>{error.message}</span>}
  </label>
);

const Select = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <SelectComponent />
    </InputController>
  ) : <SelectComponent {...props} />
);

SelectComponent.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    label: PropTypes.string.isRequired,
  })),
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({}),
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};

SelectComponent.defaultProps = {
  label: null,
  disabled: false,
  error: null,
  className: null,
  value: '',
  placeholder: '',
  name: '',
  options: [],
  onChange: () => {},
};

Select.propTypes = {
  name: PropTypes.string,
};

Select.defaultProps = {
  name: '',
};

export default memo(Select);
