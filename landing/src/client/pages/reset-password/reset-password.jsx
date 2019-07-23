import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Error from '~/components/error';
import Button from '~/components/button';
import Form, { Wrap } from '~/components/form';
import Input from '~/components/input';
import Link from '~/components/link';

import Auth from '~/layouts/auth';
import Layout from '~/layouts/main';

import { states } from '~/constants';

import { setFormValue } from '~/helpers';
import { resetPassword } from '~/resources/account/account.api';

import styles from './reset-password.styles.pcss';

export default class ResetPassword extends PureComponent {
  static propTypes = {
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.setPassword = setFormValue('password').bind(this);

    this.token = props.token;
    this.state = {
      password: '',
      isLoading: false,
      error: null,
    };

    this.submitSigninAsync = this.submitSignin.bind(this);
  }

  static getInitialProps({ query }) {
    return { token: query.token };
  }

  async submitSignin(event) {
    event.preventDefault();

    const { password } = this.state;

    this.setState({ isLoading: true, error: null });
    const newState = {};

    try {
      await resetPassword({ password, token: this.token });
      newState.emailSent = true;
    } catch (error) {
      newState.error = error;
    }

    this.setState({
      ...newState,
      isLoading: false,
    });
  }

  form() {
    const {
      password,
      emailSent,
      error,
      isLoading,
    } = this.state;

    if (emailSent) {
      return (
        <div>
          <h2> Password Changed </h2>
          <p>
            Your password has been changed. Please
            <Link href="/signin">Log In</Link>
            to continue.
          </p>
        </div>
      );
    }

    return (
      <Fragment>
        <h2 key="title">Reset Your Password</h2>

        <Form key="form" onSubmit={this.submitSigninAsync}>
          <p>Please choose new password.</p>

          <Input
            value={password}
            onChange={this.setPassword}
            required
            placeholder="New Password"
            type="password"
          />

          <Error error={error} />

          <div>
            <Button
              className={styles.signin}
              type="submit"
              state={states.purple}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Fragment>
    );
  }

  render(props) {
    return (
      <Layout state={states.purple}>
        <Layout.HeaderContent state={states.purple}>
          <Auth className={styles.panel}>
            <Wrap className={styles.formWrap}>
              {this.form()}
            </Wrap>
          </Auth>
        </Layout.HeaderContent>
      </Layout>
    );
  }
}
