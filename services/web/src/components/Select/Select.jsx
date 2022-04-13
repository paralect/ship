import { forwardRef } from 'react';
import ReactSelect, { components } from 'react-select';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { CloseSmallIcon, ArrowDownIcon } from 'public/icons';

import { getCustomStyle } from './helpers';
import styles from './Select.module.css';

const Select = forwardRef(({
  isMulti, value, onChange, options, name, label, placeholder,
  disabled, error, prefixOfSelected, className,
}, ref) => {
  const MultiValueRemove = (props) => (
    !disabled && (
    <components.MultiValueRemove {...props}>
      <CloseSmallIcon />
    </components.MultiValueRemove>
    )
  );
  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <ArrowDownIcon />
    </components.DropdownIndicator>
  );

  const SingleValue = (props) => {
    const { selectProps } = props;
    const { prefixOfSelected: currentPrefix, value: currentValue } = selectProps;
    const validatedLabel = Array.isArray(currentValue) ? currentValue[0].label : currentValue.label;

    return (
      <components.SingleValue {...props}>
        {currentPrefix
          ? `${currentPrefix} ${validatedLabel}`
          : validatedLabel}
      </components.SingleValue>
    );
  };

  SingleValue.propTypes = {
    selectProps: PropTypes.shape({
      prefixOfSelected: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array,
      ]),
    }).isRequired,
  };

  return (
    <div className={cn(styles.container, className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn({
            [styles.error]: error,
          }, styles.label)}
        >
          {label}
        </label>
      )}
      <ReactSelect
        value={value}
        onChange={onChange}
        options={options}
        name={name}
        placeholder={placeholder}
        isDisabled={disabled}
        isMulti={isMulti}
        prefixOfSelected={prefixOfSelected}
        classNamePrefix="select"
        hideSelectedOptions={false}
        isFocused={false}
        isClearable={false}
        styles={getCustomStyle(error)}
        components={{ MultiValueRemove, DropdownIndicator, SingleValue }}
        className={cn({
          [styles.error]: error,
        }, styles.select)}
        ref={ref}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </div>
  );
});

Select.propTypes = {
  isMulti: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    label: PropTypes.string.isRequired,
  })),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  prefixOfSelected: PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  isMulti: false,
  value: null,
  onChange: null,
  options: [],
  name: null,
  label: null,
  placeholder: 'Select...',
  disabled: false,
  error: null,
  prefixOfSelected: null,
  className: null,
};

export default Select;
