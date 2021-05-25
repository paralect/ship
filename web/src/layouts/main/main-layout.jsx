import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';
import Footer from './footer';

import styles from './main-layout.pcss';

function MainLayout({ children }) {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(MainLayout);
