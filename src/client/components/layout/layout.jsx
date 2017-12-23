import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toast from 'components/common/toast';
import Header from './components/header';

import styles from './layout.styles.pcss';

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div>
        <Header />

        <div className={styles.page}>
          {this.props.children}
        </div>

        <Toast />
      </div>
    );
  }
}

export default Layout;
