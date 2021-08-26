/* eslint-disable no-nested-ternary */
import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ReactSelect, { components } from 'react-select';

import Icon from 'components/icon';

import InputController from '../input-controller';
import { getCustomStyle } from './helpers';

import styles from './multi-select.styles.pcss';

const MultiSelectComponent = ({
  options, label, disabled, error, className, onChange, value, name,
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
      htmlFor={name}
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
        name={name}
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

const MultiSelect = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <MultiSelectComponent />
    </InputController>
  ) : <MultiSelectComponent {...props} />
);

MultiSelectComponent.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  value: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

MultiSelectComponent.defaultProps = {
  label: null,
  disabled: false,
  error: null,
  className: null,
  onChange: null,
  name: '',
  value: undefined,
  options: [],
};

MultiSelect.propTypes = {
  name: PropTypes.string,
};

MultiSelect.defaultProps = {
  name: '',
};

export default memo(MultiSelect);
