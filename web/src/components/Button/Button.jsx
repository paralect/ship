import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ToRightIcon } from 'public/icons';

import Spinner from 'components/Spinner';

import styles from './Button.module.css';

const types = {
  primary: 'primary',
  secondary: 'secondary',
  text: 'text',
  link: 'link',
};

const sizes = {
  l: 'l',
  m: 'm',
  s: 's',
};

const Button = ({
  children, onClick, type, htmlType, size,
  withIcon, loading, disabled, className,
}) => (
  <button
      // eslint-disable-next-line react/button-has-type
    type={htmlType}
    onClick={onClick}
    className={cn(
      {
        [styles.loading]: loading,
        [styles.disabled]: disabled,
      },
      styles.button,
      styles[type],
      styles[size],
      className,
    )}
  >
    {loading
      ? <Spinner theme={type === types.primary && 'dark'} size="s" />
      : (
        <span className={styles.value}>
          {children}
          {(type === types.link && withIcon) && <ToRightIcon className={styles.icon} /> }
        </span>
      )}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(Object.values(types)),
  htmlType: PropTypes.string,
  size: PropTypes.oneOf(Object.values(sizes)),
  withIcon: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: null,
  type: types.primary,
  htmlType: 'button',
  size: sizes.m,
  withIcon: false,
  loading: false,
  disabled: false,
  className: null,
};

export default React.memo(Button);
