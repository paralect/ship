import React from 'react';
import PropTypes from 'prop-types';

import Header from './components/header';

import styles from './styles.pcss';

const PrivacyLayout = ({ children }) => {
  return (
    <div className={styles.wrap}>
      <Header />
      {children}
    </div>
  );
};

PrivacyLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivacyLayout;
