import React from 'react';

import styles from './footer.styles.pcss';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      {`Ship, ${year} © All rights reserved`}
    </footer>
  );
};

export default Footer;
