import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withRouter } from 'next/router';
import classnames from 'classnames';

import Logo from '~/static/logo.svg';

import styles from './styles.pcss';

class Header extends Component {
  static propTypes = {
    router: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  isActiveLink(href) {
    return this.props.router.pathname === href;
  }

  render() {
    return (
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link prefetch href="/">
            <a href="/"><Logo /></a>
          </Link>
        </div>

        <ul className={styles.links}>
          <li className={styles.linkItem}>
            <Link prefetch href="/privacy-policy">
              <a
                className={classnames(styles.link, {
                  [styles.linkActive]: this.isActiveLink('/privacy-policy'),
                })}
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
            </Link>
          </li>
          <li className={styles.linkItem}>
            <Link prefetch href="/terms">
              <a
                className={classnames(styles.link, {
                  [styles.linkActive]: this.isActiveLink('/terms'),
                })}
                href="/terms"
              >
                Terms of Service
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Header);
