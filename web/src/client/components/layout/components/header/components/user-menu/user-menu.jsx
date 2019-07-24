import React, { Component } from 'react';
import classnames from 'classnames';

import { Link } from 'react-router-dom';

import {
  FaAngleDown,
  FaUnlockAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import UserCircleO from 'components/common/icons/user-circle-o';

import {
  profilePath,
  changePasswordPath,
  logoutPath,
} from 'components/layout/layout.paths';

import styles from './user-menu.styles.pcss';

const linksList = [
  {
    label: 'Profile',
    to: profilePath(),
    icon: UserCircleO,
    routerLink: true,
  },
  {
    label: 'Change Password',
    to: changePasswordPath(),
    icon: FaUnlockAlt,
    routerLink: true,
  },
  {
    label: 'Log Out',
    to: logoutPath(),
    icon: FaSignOutAlt,
    routerLink: false,
  },
];

class UserMenu extends Component {
  static links() {
    return linksList.map((link) => {
      const linkContent = (
        <>
          <link.icon size={16} />
          <span>
            {link.label}
          </span>
        </>
      );

      const linkEl = link.routerLink
        ? (
          <Link to={link.to} className={styles.link}>
            {linkContent}
          </Link>
        )
        : (
          <a href={link.to.pathname} className={styles.link}>
            {linkContent}
          </a>
        );

      return (
        <li key={link.label}>
          {linkEl}
        </li>
      );
    });
  }

  state = {
    menuOpen: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onToggleMenu = () => {
    const { menuOpen } = this.state;

    this.setState({ menuOpen: !menuOpen });
  };

  onDocumentClick = (e) => {
    const el = e.target;
    if (!(this.menu && el instanceof Node && this.menu.contains(el))) {
      this.setState({ menuOpen: false });
    }
  };

  onEnterDown = (e) => {
    if (e.keyCode === 13) {
      this.closeMenu();
    }
  };

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { menuOpen } = this.state;

    return (
      <span className={styles.user}>
        <span
          className={styles.userBtn}
          role="button"
          tabIndex="0"
          onClick={this.onToggleMenu}
          onKeyDown={this.onEnterDown}
          ref={(menu) => {
            this.menu = menu;
          }}
        >
          <UserCircleO size={30} />
          <FaAngleDown
            size={20}
            className={classnames(styles.angle, { [styles.open]: menuOpen })}
          />
        </span>

        <div
          className={classnames(styles.menu, {
            [styles.open]: menuOpen,
          })}
        >
          <ul className={styles.list}>
            {UserMenu.links()}
          </ul>
        </div>
      </span>
    );
  }
}

export default UserMenu;
