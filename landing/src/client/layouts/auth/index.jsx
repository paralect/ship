import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.pcss';

const Auth = ({ children, className }) => {
  return (
    <div className={styles.page}>
      <div className={classnames(styles.panel, className)}>
        {children}
      </div>
    </div>
  );
};

Auth.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Auth.defaultProps = {
  className: '',
};

export default Auth;
