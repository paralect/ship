import React, { useState, forwardRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ShowPasswordIcon, HidePasswordIcon } from 'public/icons';

import styles from './Input.module.css';

const Input = forwardRef(({
  value, onChange, type, name, label, placeholder, disabled,
  error, maxLength, onFocus, Icon, customIcon, iconPosition, className,
}, ref) => {
  const [currentType, setCurrentType] = useState(type);

  const onEyeClick = () => {
    if (currentType === 'password') setCurrentType('text');
    else setCurrentType('password');
  };

  const passwordIcon = currentType === 'password'
    ? <ShowPasswordIcon className={styles.passwordIcon} onClick={onEyeClick} />
    : <HidePasswordIcon className={styles.passwordIcon} onClick={onEyeClick} />;

  const getIcon = () => {
    if (type === 'password') return passwordIcon;
    if (customIcon) return customIcon;
    if (Icon) return <Icon className={styles.icon} />;
    return null;
  };

  return (
    <div className={cn([styles.container], className)}>
      {label && (
      <label
        htmlFor={name}
        className={cn({
          [styles.error]: error,
        }, styles.label, className)}
      >
        {label}
      </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          name={name}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
          maxLength={maxLength}
          ref={ref}
          className={cn({
            [styles.error]: error,
            [styles.iconOnRight]: type === 'password' || Icon,
            [styles.iconOnLeft]: Icon && iconPosition === 'left',
          }, styles.input)}
        />
        <div className={cn({
          [styles.iconOnLeft]: iconPosition === 'left',
        }, styles.iconWrapper)}
        >
          {getIcon()}
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </div>
  );
});

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password']),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  maxLength: PropTypes.number,
  onFocus: PropTypes.func,
  Icon: PropTypes.elementType,
  customIcon: PropTypes.element,
  iconPosition: PropTypes.string,
  className: PropTypes.string,
};

Input.defaultProps = {
  value: null,
  onChange: null,
  type: 'text',
  name: null,
  label: null,
  placeholder: null,
  disabled: false,
  error: null,
  maxLength: 150,
  onFocus: null,
  Icon: null,
  customIcon: null,
  iconPosition: 'right',
  className: null,
};

export default Input;
