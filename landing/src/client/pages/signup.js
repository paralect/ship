import React, { PureComponent } from 'react';
import Layout from '~/layouts/main';
import Button from '~/components/button';
import Error from '~/components/error';
import { setFormValue } from '~/helpers';
import { signup } from '~/resources/account/account.api';
import config from '~/config';

export default class Signup extends PureComponent {
  constructor(...args) {
    super(...args);
    this.setFirstName = setFormValue('firstName').bind(this);
    this.setLastName = setFormValue('lastName').bind(this);
    this.setEmail = setFormValue('email').bind(this);
    this.setPassword = setFormValue('password').bind(this);
  }

  componentWillMount() {
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
      `${config.apiUrl}/account/verifyEmail/${this.state._signupToken}` :
      null;

    const devVerifyEmailLinkEl = devVerifyEmailLink && (
      <a href={devVerifyEmailLink}> Verify email (dev) </a>
    );

    return (
      <Layout>
        <div className="auth page">
          <style jsx>{`
            .page {
              background: var(--color-secondary);

              & .panel {
                height: 600px;
                width: 1014px;

                & img {
                  min-width: 450px;
                }

                & form {
                  & .input:first-child {
                    margin-right: 16px;
                  }

                  & .names {
                    display: flex;
                    & .input {
                      width: 50%;
                    }
                  }

                  & :global(button.signup) {
                    background-image: linear-gradient(to right, #18c76d 0%, #08af81 100%);
                    margin-top: var(--form-padding)
                  }
                }

                & .signup-success {
                  margin: auto;
                  width: 100%;
                  padding: 30px;
                }
              }
            }
          `}</style>

          <div className="panel">
            {this.state.signupSuccess ? (
              <div className="signup-success">
                <h2> Thank you for signing up! </h2>
                <p>
                  The verification email has been sent to {this.state.email}. <br />
                  Please follow the instructions from the email to complete a signup process.
                </p>
                {devVerifyEmailLinkEl}
              </div>
            ) : (
              <div className="form-wrap">
                <h2> Sign Up </h2>

                <form onSubmit={this.submitSignup} className="form">
                  <div className="names">
                    <input
                      value={this.state.firstName}
                      onChange={this.setFirstName}
                      required
                      type="text"
                      placeholder="First Name"
                      className="input"
                    />
                    <input
                      value={this.state.lastName}
                      onChange={this.setLastName}
                      required
                      type="text"
                      placeholder="Last Name"
                      className="input"
                    />
                  </div>
                  <input
                    value={this.state.email}
                    onChange={this.setEmail}
                    required
                    type="email"
                    placeholder="Email"
                    className="input"
                  />
                  <input
                    value={this.state.password}
                    onChange={this.setPassword}
                    required
                    type="password"
                    placeholder="Password"
                    className="input"
                  />

                  <Error error={this.state.error} />

                  <Button
                    className="signup"
                    action="submit"
                    isLoading={this.state.isLoading}
                  >
                    Join
                  </Button>

                </form>
              </div>
            )}
            <img alt="signup" src="/static/postman.jpg" />
          </div>
        </div>
      </Layout>
    );
  }
}
