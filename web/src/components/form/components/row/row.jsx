import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './row.styles.pcss';

const Row = ({ children, className }) => (
  <div className={classnames(styles.row, className)}>
    {children}
  </div>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Row.defaultProps = {
  className: '',
};

export default Row;
