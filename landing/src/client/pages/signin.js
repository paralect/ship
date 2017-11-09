import React, { PureComponent } from 'react';
import Link from 'next/link';

import Error from '~/components/Error';
import Button from '~/components/Button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { signin } from '~/resources/account/account.api';

export default class Signin extends PureComponent {
  constructor(...args) {
    super(...args);
    this.setEmail = setFormValue('email').bind(this);
    this.setPassword = setFormValue('password').bind(this);
  }

  componentWillMount() {
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
      await signin({ email: this.state.email, password: this.state.password });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <Layout>
        <div className="_root auth page">
          <style jsx>{`
            :root {
              --breakpoint-small: 720px;
            }

            @custom-media --navbar-height-reached (height <= 600px);

            ._root .test {
              background: purple !important;
            }

            .page {
              background-color: var(--color-brand);

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
                      background-image: linear-gradient(to right, rgba(90,97,241,0.9) 0%, #7a00ff 100%);
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
                  value={this.state.email}
                  onChange={this.setEmail}
                  required
                  placeholder="Email"
                  type="email"
                  className="input"
                />
                <input
                  value={this.state.password}
                  onChange={this.setPassword}
                  required
                  placeholder="Password"
                  type="password"
                  className="input"
                />

                <Error error={this.state.error} />

                <div className="forgot">
                  <Link href="/forgot-password">Forgot Password?</Link>
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
                  <Link href="/signup">{"Don't have an account? Sign Up"}</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
