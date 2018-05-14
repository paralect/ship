import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ButtonLink from '~/components/button-link';
import Link from '~/components/link';
import { states } from '~/constants';

import Logo from '~/static/logo.svg';
import ArrowSvg from './components/arrow';

import styles from './styles.pcss';

const Header = ({ state }) => (
  <nav className={styles.nav}>
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={classnames(styles.item, styles.logo)}>
          <Link href="/">
            <Logo />
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
            <li className={styles.link}>
              <ButtonLink
                prefetch
                href="/signin"
                state={state}
                className={styles.login}
              >
                <span className={styles.text}>Log In</span>
                <div className={styles.arrow}><ArrowSvg /></div>
              </ButtonLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  state: PropTypes.string,
};

Header.defaultProps = {
  state: states.purple,
};

export default Header;
