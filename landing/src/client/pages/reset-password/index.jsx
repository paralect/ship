import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Error from '~/components/error';
import Button from '~/components/button';
import Form, { Wrap } from '~/components/form';
import Input from '~/components/input';

import Auth from '~/layouts/auth';

import { setFormValue } from '~/helpers';
import { resetPassword } from '~/resources/account/account.api';

import styles from './styles.pcss';

export default class Signin extends PureComponent {
  static getInitialProps({ query }) {
    return { token: query.token };
  }

  static propTypes = {
    token: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.setPassword = setFormValue('password').bind(this);

    this.token = props.token;
    this.state = {
      password: '',
      isLoading: false,

      error: null,
    };
  }

  submitSignin = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true, error: null });
    const newState = {};

    try {
      await resetPassword({ password: this.state.password, token: this.token });
      newState.emailSent = true;
    } catch (error) {
      newState.error = error;
    }

    this.setState({
      ...newState,
      isLoading: false,
    });
  }

  render(props) {
    return (
      <Auth className={styles.panel}>
        <Wrap className={styles['form-wrap']}>

          { this.state.emailSent ? (
            <div>
              <h2> Password Changed </h2>
              <p>
                Your password has been changed. Please <Link href="/signin">Log In</Link> to continue.
              </p>
            </div>
          ) : ([
            <h2 key="title">Reset Your Password</h2>,
            <Form key="form" onSubmit={this.submitSignin}>
              <Input
                value={this.state.password}
                onChange={this.setPassword}
                required
                placeholder="New Password"
                type="password"
              />

              <p>Please choose new password.</p>

              <Error error={this.state.error} />

              <div>
                <Button
                  className={styles.signin}
                  action="submit"
                  primary
                  isLoading={this.state.isLoading}
                >
                  Submit
                </Button>
              </div>
            </Form>,
          ])}
        </Wrap>
      </Auth>
    );
  }
}
