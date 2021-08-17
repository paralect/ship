import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import { getCustomStyle } from './helpers';

import styles from './select.styles.pcss';

const Select = ({
  options, label, disabled, error, placeholder, className, onChange, value,
}) => (
  <label
    htmlFor="select"
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
      name="select"
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

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    label: PropTypes.string.isRequired,
  })).isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Select.defaultProps = {
  label: null,
  disabled: false,
  error: null,
  className: null,
  value: '',
  placeholder: '',
};

export default memo(Select);
