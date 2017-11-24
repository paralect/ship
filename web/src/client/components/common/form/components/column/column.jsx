import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './column.styles.pcss';

const Column = ({ children, className }) => (
  <div className={classnames(styles.column, className)}>{children}</div>
);

Column.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Column.defaultProps = {
  className: null,
};

export default Column;
