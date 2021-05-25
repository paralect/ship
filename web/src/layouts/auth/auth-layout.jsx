import React from 'react';
import PropTypes from 'prop-types';

import styles from './auth-layout.pcss';

function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(AuthLayout);
