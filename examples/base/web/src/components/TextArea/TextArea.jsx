import { forwardRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './TextArea.module.css';

const TextArea = forwardRef(({
  value, onChange, name, label, placeholder, disabled,
  error, maxLength, height, onFocus, className,
}, ref) => (
  <div className={cn([styles.container], className)}>
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
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      disabled={disabled}
      maxLength={maxLength}
      style={{ height }}
      ref={ref}
      className={cn({
        [styles.error]: error,
      }, styles.textarea)}
    />
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
));

TextArea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  maxLength: PropTypes.number,
  height: PropTypes.string,
  onFocus: PropTypes.func,
  className: PropTypes.string,
};

TextArea.defaultProps = {
  value: null,
  onChange: null,
  name: null,
  label: null,
  placeholder: null,
  disabled: false,
  error: null,
  maxLength: 500,
  height: '80px',
  onFocus: null,
  className: null,
};

export default TextArea;
