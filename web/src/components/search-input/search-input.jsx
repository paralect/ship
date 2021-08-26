import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash/debounce';

import Icon from 'components/icon';

import styles from './search-input.styles.pcss';

function SearchInput({
  onChange, disabled, interval, apiHandler, placeholder, className, errors, value, label, ...props
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedQuery = useCallback(debounce(apiHandler, interval), []);

  const handleChange = useCallback(({ target: { value: inputValue } }) => {
    onChange(inputValue);
    delayedQuery(inputValue);
  }, [onChange, delayedQuery]);

  return (
    <div>
      <label
        htmlFor="input"
        className={cn(styles.label, {
          [styles.error]: errors.length,
        })}
      >
        {label}
        <div className={styles.inputRoot}>
          <Icon
            icon="search"
            className={styles.icon}
          />
          <input
            id="input"
            name="input"
            value={value}
            placeholder={placeholder}
            className={cn(styles.input, className, {
              [styles.error]: errors.length,
              [styles.disabled]: disabled,
            })}
            onChange={handleChange}
            {...props}
          />
        </div>
      </label>
      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
}

SearchInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  apiHandler: PropTypes.func.isRequired,
  interval: PropTypes.number,
};

SearchInput.defaultProps = {
  className: '',
  value: '',
  errors: [],
  disabled: false,
  placeholder: null,
  interval: 500,
  onChange: null,
};

export default React.memo(SearchInput);
