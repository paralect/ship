// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import type { StateType as ReduxStateType } from 'resources/types';

import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaUser from 'react-icons/lib/fa/user';
import FaUnlockAlt from 'react-icons/lib/fa/unlock-alt';

import * as fromUser from 'resources/user/user.selectors';

import { indexPath, profilePath, changePasswordPath } from '../paths';

import styles from './header.styles.pcss';

type PropsType = {
  username: string,
};

type StateType = {
  showMenu: boolean,
  menuOpen: boolean,
};

class Header extends Component<PropsType, StateType> {
  state = {
    showMenu: false,
    menuOpen: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.onCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onCloseMenu);
  }

  onToggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  // eslint-disable-next-line flowtype/no-weak-types
  onCloseMenu = (e: MouseEvent) => {
    this.closeMenu(e.target);
  };

  onEnterDown = (e: SyntheticKeyboardEvent<HTMLSpanElement>) => {
    if (e.keyCode === 13) {
      this.closeMenu(e.target);
    }
  };

  closeMenu(target: EventTarget) {
    if (target !== this.userBtn) {
      this.setState({ menuOpen: false });
    }
  }

  userBtn: ?HTMLSpanElement;

  render(): Node {
    return (
      <div className={styles.header}>
        <Link className={styles.title} to={indexPath()}>
          Paralect Koa React Starter
        </Link>

        <span
          className={classnames(styles.user, {
            [styles.showMenu]: this.state.showMenu,
          })}
        >
          <span
            className={styles.userBtn}
            role="button"
            tabIndex="0"
            onClick={this.onToggleMenu}
            onKeyDown={this.onEnterDown}
            ref={(btn: ?HTMLSpanElement) => {
              this.userBtn = btn;
            }}
          >
            {this.props.username}
            <FaCaretDown size={20} />
          </span>

          <div
            className={classnames(styles.menu, {
              [styles.open]: this.state.menuOpen,
            })}
          >
            <Link to={profilePath()}>
              <FaUser size={15} /> Profile
            </Link>
            <Link to={changePasswordPath()}>
              <FaUnlockAlt size={15} /> Change Password
            </Link>
          </div>
        </span>
      </div>
    );
  }
}

export default connect((state: ReduxStateType): PropsType => ({
  username: fromUser.getUsername(state),
}))(Header);
