import React, { PureComponent } from 'react';
import getConfig from 'next/config';

import Button from '~/components/button';
import Error from '~/components/error';
import Form, { Wrap } from '~/components/form';
import Input from '~/components/input';
import SignUpGoogle from '~/components/signup-google';

import Layout from '~/layouts/main';
import Auth from '~/layouts/auth';

import { states } from '~/constants';

import { setFormValue } from '~/helpers';
import { signup } from '~/resources/account/account.api';

import styles from './signup.styles.pcss';

const {
  publicRuntimeConfig: { apiUrl },
} = getConfig();

export default class Signup extends PureComponent {
  constructor(props) {
    super(props);

    this.setFirstName = setFormValue('firstName').bind(this);
    this.setLastName = setFormValue('lastName').bind(this);
    this.setEmail = setFormValue('email').bind(this);
    this.setPassword = setFormValue('password').bind(this);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      signupSuccess: false,

      isLoading: false,

      error: null,
    };

    this.submitSignupAsync = this.submitSignup.bind(this);
  }

  async submitSignup(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
    });
    try {
      const {
        email,
        firstName,
        lastName,
        password,
      } = this.state;

      const signupResult = await signup({
        firstName,
        lastName,
        email,
        password,
      });

      this.setState({
        signupSuccess: true,
        _signupToken: signupResult._signupToken,
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      _signupToken,
      signupSuccess,
      email,
      firstName,
      lastName,
      password,
      error,
      isLoading,
    } = this.state;

    const devVerifyEmailLink = _signupToken
      ? `${apiUrl}/account/verifyEmail/${_signupToken}`
      : null;

    const devVerifyEmailLinkEl = devVerifyEmailLink && (
      <a href={devVerifyEmailLink}> Verify email (dev) </a>
    );

    return (
      <Layout state={states.green}>
        <Layout.HeaderContent state={states.green}>
          <Auth className={styles.panel}>
            {signupSuccess ? (
              <div className={styles['signup-success']}>
                <h2>Thank you for signing up!</h2>
                <p>
                  The verification email has been sent to
                  {email}.
                  <br />
                  Please follow the instructions from the email to complete a signup process.
                </p>
                {devVerifyEmailLinkEl}
              </div>
            ) : (
              <Wrap>
                <h2>Sign Up</h2>

                <Form onSubmit={this.submitSignupAsync} className={styles.form}>
                  <div className={styles.names}>
                    <Input
                      key="first-name"
                      value={firstName}
                      onChange={this.setFirstName}
                      required
                      type="text"
                      placeholder="First Name"
                    />
                    <Input
                      key="last-name"
                      value={lastName}
                      onChange={this.setLastName}
                      required
                      type="text"
                      placeholder="Last Name"
                    />
                  </div>
                  <Input
                    key="email"
                    value={email}
                    onChange={this.setEmail}
                    required
                    type="email"
                    placeholder="Email"
                  />
                  <Input
                    key="password"
                    value={password}
                    onChange={this.setPassword}
                    required
                    type="password"
                    placeholder="Password"
                  />

                  <Error error={error} />

                  <Button
                    className={styles.signup}
                    type="submit"
                    isLoading={isLoading}
                  >
                    Join
                  </Button>
                </Form>

                <SignUpGoogle />
              </Wrap>
            )}
            <img alt="signup" src="/static/postman.jpg" />
          </Auth>
        </Layout.HeaderContent>
      </Layout>
    );
  }
}
