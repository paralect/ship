import React, { PureComponent } from 'react';
import getConfig from 'next/config';

import Button from '~/components/button';
import Error from '~/components/error';
import Form, { Wrap } from '~/components/form';
import Input from '~/components/input';

import Layout from '~/layouts/main';
import Auth from '~/layouts/auth';

import { states } from '~/constants';

import { setFormValue } from '~/helpers';
import { signup } from '~/resources/account/account.api';

import styles from './styles.pcss';

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
  }

  submitSignup = async (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true,
    });
    try {
      const signupResult = await signup({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
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
    const devVerifyEmailLink = this.state._signupToken ?
      `${apiUrl}/account/verifyEmail/${this.state._signupToken}` :
      null;

    const devVerifyEmailLinkEl = devVerifyEmailLink && (
      <a href={devVerifyEmailLink}> Verify email (dev) </a>
    );

    return (
      <Layout state={states.green}>
        <Layout.HeaderContent state={states.green}>
          <Auth className={styles.panel}>
            {this.state.signupSuccess ? (
              <div className={styles['signup-success']}>
                <h2>Thank you for signing up!</h2>
                <p>
                  The verification email has been sent to {this.state.email}. <br />
                  Please follow the instructions from the email to complete a signup process.
                </p>
                {devVerifyEmailLinkEl}
              </div>
            ) : (
              <Wrap>
                <h2>Sign Up</h2>

                <Form onSubmit={this.submitSignup} className={styles.form}>
                  <div className={styles.names}>
                    <Input
                      key="first-name"
                      value={this.state.firstName}
                      onChange={this.setFirstName}
                      required
                      type="text"
                      placeholder="First Name"
                    />
                    <Input
                      key="last-name"
                      value={this.state.lastName}
                      onChange={this.setLastName}
                      required
                      type="text"
                      placeholder="Last Name"
                    />
                  </div>
                  <Input
                    key="email"
                    value={this.state.email}
                    onChange={this.setEmail}
                    required
                    type="email"
                    placeholder="Email"
                  />
                  <Input
                    key="password"
                    value={this.state.password}
                    onChange={this.setPassword}
                    required
                    type="password"
                    placeholder="Password"
                  />

                  <Error error={this.state.error} />

                  <Button
                    className={styles.signup}
                    action="submit"
                    isLoading={this.state.isLoading}
                  >
                    Join
                  </Button>

                </Form>
              </Wrap>
            )}
            <img alt="signup" src="/static/postman.jpg" />
          </Auth>
        </Layout.HeaderContent>
      </Layout>
    );
  }
}
