import React, { PureComponent } from 'react';
import Link from 'next/link';
import getConfig from 'next/config';

import Error from '~/components/error';
import Button from '~/components/button';
import Form, { Wrap } from '~/components/form';
import Input from '~/components/input';
import SignUpGoogle from '~/components/signup-google';
import TwoFaModal from '~/components/two-fa-modal';

import Layout from '~/layouts/main';
import Auth from '~/layouts/auth';
import { states } from '~/constants';

import { setFormValue } from '~/helpers';
import { signin } from '~/resources/account/account.api';

import styles from './signin.styles.pcss';

const {
  publicRuntimeConfig: { webUrl },
} = getConfig();

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
      isTwoFaEnabled: true,
    };
  }

  submitTwoFa = async (twoFaCode) => {
    const { password, email } = this.state;
    const response = await signin({
      email,
      password,
      twoFaCode,
    });

    window.location.href = `${webUrl}?token=${response.token}`;
  }

  submitSignin = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = this.state;

      this.setState({ isLoading: true });

      const response = await signin({
        email,
        password,
      });

      if (response.shouldCompleteTwoFa) {
        this.setState({ isTwoFaEnabled: true });
      } else {
        window.location.href = `${webUrl}?token=${response.token}`;
      }
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onModalClose = () => {
    this.setState({ isTwoFaEnabled: false });
  }

  render() {
    const {
      email,
      password,
      error,
      isLoading,
      isTwoFaEnabled,
    } = this.state;

    return (
      <Layout state={states.blue}>
        <Layout.HeaderContent state={states.blue}>
          <Auth className={styles.panel}>
            <img className={styles.greeting} alt="Welcome Back" src="/static/password.jpg" />

            <Wrap>
              <h2 className={styles.title}>Welcome Back!</h2>

              <Form onSubmit={this.submitSignin}>
                <Input
                  key="email"
                  value={email}
                  onChange={this.setEmail}
                  required
                  placeholder="Email"
                  type="email"
                />
                <Input
                  key="password"
                  value={password}
                  onChange={this.setPassword}
                  required
                  placeholder="Password"
                  type="password"
                />

                { isTwoFaEnabled && (
                  <TwoFaModal
                    onClose={this.onModalClose}
                    onSubmit={this.submitTwoFa}
                    isShown={isTwoFaEnabled}
                  />
                )}

                <Error error={error} />

                <div className={styles.forgot}>
                  <Link href="/forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                  </Link>
                </div>
                <div className={styles.submit}>
                  <Button
                    className={styles.signin}
                    type="submit"
                    primary
                    isLoading={isLoading}
                    state={states.blue}
                  >
                    Let me in
                  </Button>
                </div>

                <div className={styles.signup}>
                  <Link href="/signup">
                    <a href="/signup">Don&apos;t have an account? Sign Up</a>
                  </Link>
                </div>
              </Form>

              <SignUpGoogle />
            </Wrap>
          </Auth>
        </Layout.HeaderContent>
      </Layout>
    );
  }
}
