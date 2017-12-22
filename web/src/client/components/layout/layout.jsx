import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Toast from 'components/common/toast';
import Index from 'components/index/async';
import Profile from 'components/profile/async';
import Header from './components/header';

import styles from './layout.styles.pcss';

class Layout extends Component {
  render() {
    return (
      <div>
        <Header />

        <div className={styles.page}>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </div>

        <Toast />
      </div>
    );
  }
}

export default Layout;
