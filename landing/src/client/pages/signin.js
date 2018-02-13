import React, { PureComponent } from 'react';
import Link from 'next/link';

import Error from '~/components/error';
import Button from '~/components/button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { signin } from '~/resources/account/account.api';

import config from '~/config';

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
        <div className="auth page">
          <style jsx>{`
            .page {
              background-color: var(--color-brand);
              @custom-media --navbar-height-reached (height <= 700px);

              @media (--navbar-height-reached) {
                padding-top: 20px;
                align-items: flex-start;
              }

              & .panel {
                width: 850px;

                & img {
                  min-width: 400px;
                }

                & .form-wrap {
                  display: flex;
                  flex-direction: column;
                  padding: 0 30px;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 100%;

                  & form {
                    & .forgot {
                      width: 100%;
                      text-align: right;
                    }

                    & :global(button.signin) {
                      /*https://github.com/zeit/styled-jsx/issues/273*/
                      background: var(--button-primary-gradient);
                      margin-top: var(--form-padding)
                    }

                    & .signup {
                      width: 100%;
                      text-align: center;
                      margin-top: 2rem;
                    }
                  }
                }
              }
            }
          `}</style>

          <div className="panel">
            <img className="greeting" alt="Welcome Back" src="/static/password.jpg" />

            <div className="form-wrap">
              <h2> Welcome Back! </h2>

              <form className="form" onSubmit={this.submitSignin}>
                <input
                  key="email"
                  value={this.state.email}
                  onChange={this.setEmail}
                  required
                  placeholder="Email"
                  type="email"
                  className="input"
                />
                <input
                  key="password"
                  value={this.state.password}
                  onChange={this.setPassword}
                  required
                  placeholder="Password"
                  type="password"
                  className="input"
                />

                <Error error={this.state.error} />

                <div className="forgot">
                  <Link href="/forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                  </Link>
                </div>
                <div className="submit">
                  <Button
                    className="signin"
                    action="submit"
                    primary
                    isLoading={this.state.isLoading}
                  >
                    Let me in
                  </Button>
                </div>

                <div className="signup">
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
