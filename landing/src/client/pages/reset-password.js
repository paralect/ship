import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Error from '~/components/error';
import Button from '~/components/button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { resetPassword } from '~/resources/account/account.api';

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
      <Layout>
        <div className="auth page">
          {/* <style jsx>{`
            .page {
              & .panel {
                width: 500px;
                height: auto;
                padding: var(--form-padding);

                & .form-wrap {
                  display: flex;
                  flex-direction: column;
                  padding: 0 30px;
                  justify-content: center;
                  align-items: flex-start;
                  width: 100%;
                  height: 100%;

                  & form {
                    & :global(button) {
                      margin: var(--form-padding) 0;
                      background: var(--button-primary-gradient)
                    }
                  }
                }
              }
            }
          `}</style> */}

          <div className="panel">
            <div className="form-wrap">

              { this.state.emailSent ? (
                <div>
                  <h2> Password Changed </h2>
                  <p>
                    Your password has been changed. Please <Link href="/signin">Log In</Link> to continue.
                  </p>
                </div>
              ) : ([
                <h2> Reset Your Password</h2>,
                <form className="form" onSubmit={this.submitSignin}>
                  <input
                    value={this.state.password}
                    onChange={this.setPassword}
                    required
                    placeholder="New Password"
                    type="password"
                    className="input"
                  />

                  <p className="description">
                    Please choose new password.
                  </p>

                  <Error error={this.state.error} />

                  <div className="submit">
                    <Button
                      className="signin"
                      action="submit"
                      primary
                      isLoading={this.state.isLoading}
                    >
                      Submit
                    </Button>
                  </div>
                </form>,
              ])}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
