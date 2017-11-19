import React, { PureComponent } from 'react';

import Error from '~/components/error';
import Button from '~/components/button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { forgotPassword } from '~/resources/account/account.api';

export default class Signin extends PureComponent {
  constructor(...args) {
    super(...args);
    this.setEmail = setFormValue('email').bind(this);
  }

  componentWillMount() {
    this.state = {
      email: '',
      emailSent: false,

      isLoading: false,

      error: null,
    };
  }

  submitSignin = async (event) => {
    event.preventDefault();
    try {
      this.setState({ isLoading: true, error: null });
      await forgotPassword({ email: this.state.email });
      this.setState({ emailSent: true });
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
                      background-image: var(--button-primary-gradient);
                    }
                  }
                }
              }
            }
          `}</style>

          <div className="panel">
            <div className="form-wrap">

              { this.state.emailSent ? (
                <div>
                  <h2> Email Sent </h2>
                  <p>
                    {'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'}
                  </p>
                </div>
              ) : ([
                <h2> Reset Your Password </h2>,
                <form className="form" onSubmit={this.submitSignin}>
                  <input
                    value={this.state.email}
                    onChange={this.setEmail}
                    required
                    placeholder="Email"
                    type="email"
                    className="input"
                  />

                  <p className="description">
                    Enter your email address and we will send
                    you a link to reset your password.
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
