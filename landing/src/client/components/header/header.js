import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

import ArrowSvg from './arrow';

import styles from './styles.css';

const Header = ({ secondary }) => (
  <nav className={styles.nav}>
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={classnames(styles.item, styles.logo)}>
          <Link href="/">
            <a href="/"> <img src="static/logo.png" alt="logo" /> </a>
          </Link>
        </div>
        <div className={styles.item}>
          <ul className={styles.links}>
            <li className={styles.link}>
             About
            </li>
            <li className={styles.link}>
              Blog
            </li>
            <li className={classnames(styles.link, styles.login, {
              [styles.secondary]: secondary,
            })}
            >
              <Link prefetch href="/signin">
                <a href="/signin">
                  <span className={styles.text}>Log In</span>
                  <div className={styles.arrow}><ArrowSvg /></div>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  secondary: PropTypes.bool,
};

Header.defaultProps = {
  secondary: false,
};

export default Header;
