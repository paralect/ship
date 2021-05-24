import React from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from 'routes';

import styles from './menu.styles.pcss';

const links = [
  {
    label: 'Dashboard',
    to: routes.home.url(),
  },
  {
    label: 'Reports',
    to: '/reports',
  },
];

function Menu() {
  return (
    <ul className={styles.menu}>
      {links.map((link) => (
        <li key={link.label} className={styles.menu__item}>
          <NavLink
            to={link.to}
            exact
            className={styles.menu__link}
            activeClassName={styles.menu__link_active}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default React.memo(Menu);
