import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { fetchUser } from 'resources/user/user.actions';

import Index from 'components/index/async';
import Profile from 'components/profile/async';
import Header from './components/header';

import styles from './layout.styles.pcss';

class Layout extends Component {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    this.props.fetchUser();
  }

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
      </div>
    );
  }
}

export default connect(null, {
  fetchUser,
})(Layout);
