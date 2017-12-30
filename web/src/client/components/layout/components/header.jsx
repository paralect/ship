import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaUser from 'react-icons/lib/fa/user';
import FaUnlockAlt from 'react-icons/lib/fa/unlock-alt';

import * as fromUser from 'resources/user/user.selectors';

import { indexPath, profilePath, changePasswordPath } from '../paths';

import styles from './header.styles';

class Header extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  };

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

  onToggleMenu = (e) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  onCloseMenu = (e) => {
    if (e.target !== this.userBtn) {
      this.setState({ menuOpen: false });
    }
  };

  onEnterDown = action => (e) => {
    if (e.keyCode === 13) {
      action(e);
    }
  };

  render() {
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
            onKeyDown={this.onEnterDown(this.onToggleMenu)}
            ref={(btn) => {
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

export default connect(state => ({
  username: fromUser.getUsername(state),
}))(Header);
