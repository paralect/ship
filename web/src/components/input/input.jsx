import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './input.styles.pcss';

function Input({
  onChange, className, errors, ...props
}) {
  const handleChange = React.useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <div>
      <input
        className={cn(styles.input, className, {
          [styles.error]: errors.length,
        })}
        onChange={handleChange}
        {...props}
      />

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'search', 'email', 'number', 'password', 'url']),
  errors: PropTypes.arrayOf(PropTypes.string),
};

Input.defaultProps = {
  className: '',
  type: 'text',
  errors: [],
};

export default React.memo(Input);
