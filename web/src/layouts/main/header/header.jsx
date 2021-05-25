import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from 'routes';
import Logo from 'static/images/logo.svg';

import Menu from './components/menu';
import UserMenu from './components/user-menu';
import styles from './header.styles.pcss';

function Header() {
  return (
    <div className={styles.header}>
      <Link to={routes.home.url()}>
        <Logo className={styles.logo} />
      </Link>

      <div className={styles.navigation}>
        <Menu />
      </div>

      <div className={styles.menu}>
        <UserMenu />
      </div>
    </div>
  );
}

export default Header;
