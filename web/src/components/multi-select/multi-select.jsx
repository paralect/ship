/* eslint-disable no-nested-ternary */
import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ReactSelect, { components } from 'react-select';

import Icon from 'components/icon';

import { getCustomStyle } from './helpers';

import styles from './multi-select.styles.pcss';

const MultiSelect = ({
  options, label, disabled, error, className, onChange, value,
}) => {
  const MultiValueRemove = (props) => (
    <>
      {!disabled && (
        <components.MultiValueRemove {...props}>
          <Icon icon="close" />
        </components.MultiValueRemove>
      )}
    </>
  );

  return (
    <label
      htmlFor="select"
      className={cn(styles.label, className)}
    >
      {label && (
        <span
          className={cn(styles.title, className, {
            [styles.error]: error,
          })}
        >
          {label}
        </span>
      )}
      <ReactSelect
        value={value}
        name="multiSelect"
        className={cn(styles.select, {
          [styles.error]: error,
        })}
        classNamePrefix="select"
        controlHeight={80}
        isMulti
        isClearable={false}
        isSearchable
        blurInputOnSelect
        hideSelectedOptions={false}
        styles={getCustomStyle(error)}
        isFocused={false}
        isDisabled={disabled}
        closeMenuOnSelect={false}
        options={options}
        components={{ MultiValueRemove }}
        onChange={onChange}
      />
      {error && <span className={styles.error}>{error.message}</span>}
    </label>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

MultiSelect.defaultProps = {
  label: null,
  disabled: false,
  error: null,
  className: null,
};

export default memo(MultiSelect);
