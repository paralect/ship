import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.pcss';

const Wrap = ({ children, className }) => {
  return (
    <div className={classnames(styles.wrap, className)}>
      {children}
    </div>
  );
};

Wrap.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Wrap.defaultProps = {
  className: '',
};

export default Wrap;
