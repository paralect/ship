// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import { FaBell } from 'react-icons/fa';

import { indexPath } from 'components/layout/layout.paths';

import Logo from 'assets/images/logo.svg';

import Menu from './components/menu';
import Search from './components/search';
import UserMenu from './components/user-menu';

import styles from './header.styles.pcss';

const Header = (): React$Node => {
  return (
    <div className={styles.header}>
      <Link className={styles.title} to={indexPath()}>
        <Logo />
      </Link>

      <Menu className={styles.menuList} />
      <Search className={styles.search} />

      <FaBell size={20} className={styles.notificationsBtn} />

      <UserMenu />
    </div>
  );
};

export default Header;
