import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={classnames(styles.input, className)}
      {...props}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
};

Input.defaultProps = {
  className: '',
};

export default Input;
