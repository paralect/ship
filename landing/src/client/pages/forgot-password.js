import React, { PureComponent } from 'react';

import Error from '~/components/error';
import Button from '~/components/button';
import Layout from '~/layouts/main';
import { setFormValue } from '~/helpers';
import { forgotPassword } from '~/resources/account/account.api';

export default class ForgotPassword extends PureComponent {
  static emailSent() {
    return (
      <div>
        <h2>Email Sent</h2>
        <p>
          Check your email for a link to reset your password. If it doesn&apos;t
          appear within a few minutes, check your spam folder.
        </p>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.setEmail = setFormValue('email').bind(this);

    this.state = {
      email: '',
      emailSent: false,

      isLoading: false,

      error: null,
    };
  }

  submitSignin = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true, error: null });
    const newState = {};

    try {
      await forgotPassword({ email: this.state.email });
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
    return [
      <h2 key="title">Reset Your Password</h2>,
      <form key="form" className="form" onSubmit={this.submitSignin}>
        <style jsx>{`
          :global(.submitBtn) {
            margin: var(--form-padding) 0;
            background: var(--button-primary-gradient);
          }
        `}</style>

        <input
          key="email"
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
            className="submitBtn"
            action="submit"
            primary
            isLoading={this.state.isLoading}
          >
            Submit
          </Button>
        </div>
      </form>,
    ];
  }

  render() {
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
                }
              }
            }
          `}</style> */}

          <div className="panel">
            <div className="form-wrap">

              {
                this.state.emailSent
                  ? this.emailSent()
                  : this.form()
              }
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
