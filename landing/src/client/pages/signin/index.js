import React, { PureComponent } from 'react';
import Link from 'next/link';

import classnames from 'classnames';

import Error from '~/components/error';
import Button from '~/components/button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { signin } from '~/resources/account/account.api';

import config from '~/config';

import styles from './styles.css';

const { webUrl } = config;

export default class Signin extends PureComponent {
  constructor(props) {
    super(props);

    this.setEmail = setFormValue('email').bind(this);
    this.setPassword = setFormValue('password').bind(this);

    this.state = {
      email: '',
      password: '',

      isLoading: false,

      error: null,
    };
  }

  submitSignin = async (event) => {
    event.preventDefault();
    try {
      this.setState({ isLoading: true });
      const response = await signin({
        email: this.state.email,
        password: this.state.password,
      });

      window.location.href = `${webUrl}?token=${response.token}`;
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <Layout>
        <div className={classnames(styles.auth, styles.page)}>
          <div className={styles.panel}>
            <img className={styles.greeting} alt="Welcome Back" src="/static/password.jpg" />

            <div className={styles.formWrap}>
              <h2> Welcome Back! </h2>

              <form className={styles.form} onSubmit={this.submitSignin}>
                <input
                  key="email"
                  value={this.state.email}
                  onChange={this.setEmail}
                  required
                  placeholder="Email"
                  type="email"
                  className={styles.input}
                />
                <input
                  key="password"
                  value={this.state.password}
                  onChange={this.setPassword}
                  required
                  placeholder="Password"
                  type="password"
                  className={styles.input}
                />

                <Error error={this.state.error} />

                <div className={styles.forgot}>
                  <Link href="/forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                  </Link>
                </div>
                <div className={styles.submit}>
                  <Button
                    className={styles.signin}
                    action="submit"
                    primary
                    isLoading={this.state.isLoading}
                  >
                    Let me in
                  </Button>
                </div>

                <div className={styles.signup}>
                  <Link href="/signup">
                    <a href="/signup">Don&apos;t have an account? Sign Up</a>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
