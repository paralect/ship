// @flow

import React, { Component } from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import { indexPath, reportsPath } from 'components/layout/layout.paths';

import type { LocationShape } from 'react-router-dom';

import styles from './menu.styles.pcss';

type PropType = {
  className: string,
};

type LinkType = {
  label: string,
  to: LocationShape,
};

const links: Array<LinkType> = [
  {
    label: 'Dashboard',
    to: indexPath(),
  },
  {
    label: 'Reports',
    to: reportsPath(),
  },
];

class Menu extends Component<PropType> {
  static item(link: LinkType): React$Node {
    return (
      <li key={link.label} className={styles.item}>
        <NavLink
          to={link.to}
          exact
          activeClassName={styles.active}
        >
          {link.label}
        </NavLink>
      </li>
    );
  }

  render(): React$Node {
    const { className } = this.props;

    const linkNodes = links.map((link: LinkType): React$Node => {
      return Menu.item(link);
    });

    return (
      <ul className={classnames(styles.menu, className)}>
        {linkNodes}
      </ul>
    );
  }
}

export default Menu;
