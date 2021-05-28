import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './Spinner.module.css';

const sizes = {
  l: 'l',
  m: 'm',
  s: 's',
};

const Spinner = ({ theme, size }) => (
  <div className={cn(styles[size], styles.container)}>
    <svg className={cn({
      [styles.dark]: theme === 'dark',
    }, styles.spinner, styles.spinner_loading)}
    >
      <circle cx="20" cy="20" r="18" />
    </svg>
    <svg className={cn({
      [styles.dark]: theme === 'dark',
    }, styles.spinner)}
    >
      <circle cx="20" cy="20" r="18" />
    </svg>
  </div>
);

Spinner.propTypes = {
  theme: PropTypes.oneOf(['dark', 'light']),
  size: PropTypes.oneOf(Object.values(sizes)),
};

Spinner.defaultProps = {
  theme: 'light',
  size: sizes.m,
};

export default memo(Spinner);
