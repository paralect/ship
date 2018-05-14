import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Link from '~/components/link';

import Logo from '~/static/logo.svg';

import styles from './styles.pcss';

const Footer = ({ state }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={classnames(styles.wrap, styles[state])}>
      <footer className={styles.footer}>
        <div>
          <Logo />
          <div>© {currentYear}, All rights reserved</div>
        </div>

        <div className={styles.links}>
          <Link prefetch href="/privacy-policy" className={styles.link}>
            Privacy
          </Link>

          <Link prefetch href="/terms" className={styles.link}>
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
};

Footer.propTypes = {
  state: PropTypes.string.isRequired,
};

export default Footer;
