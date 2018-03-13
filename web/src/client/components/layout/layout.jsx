// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import Toast from 'components/common/toast';
import Header from './components/header';

import styles from './layout.styles.pcss';

type PropsType = {
  children: Node,
};

class Layout extends Component<PropsType> {
  render(): Node {
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
