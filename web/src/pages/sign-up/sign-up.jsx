import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import config from 'config';
import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/input';
import Button from 'components/button';

import styles from './sign-up.pcss';

function SignUp() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const [pending, setPending] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signupToken, setSignupToken] = React.useState();

  async function submit(event) {
    event.preventDefault();

    try {
      setPending(true);
      const response = await dispatch(userActions.signUp({
        firstName,
        lastName,
        email,
        password,
      }));
      if (response.signupToken) setSignupToken(response.signupToken);
      setRegistered(true);
    } catch (error) {
      setErrors(error.data.errors);
    } finally {
      setPending(false);
    }
  }

  if (user) {
    return <Redirect to={routes.home.url()} />;
  }

  if (registered) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          Thanks!
        </h1>
        <div className={styles.row}>
          We just sent an email with a confirmation link to
          {' '}
          <b>{email}</b>
          .
        </div>
        <div className={styles.row}>
          Please follow the instructions from the email to complete a sign up process.
        </div>
        {signupToken && (
          <div className={styles.links}>
            <div className={styles.row}>
              You look like a cool developer.
              {' '}
              <a href={`${config.apiUrl}/account/verify-email?token=${signupToken}`}>
                Verify email
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={styles.container}
    >
      <h1 className={styles.title}>
        Sign Up
      </h1>
      <div className={styles.row}>
        <Input
          type="text"
          value={firstName}
          onChange={setFirstName}
          errors={errors.firstName}
          placeholder="First Name"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Input
          type="text"
          value={lastName}
          onChange={setLastName}
          errors={errors.lastName}
          placeholder="Last Name"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Input
          type="email"
          value={email}
          onChange={setEmail}
          errors={errors.email}
          placeholder="Email"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Input
          type="password"
          value={password}
          onChange={setPassword}
          errors={errors.password}
          placeholder="Password"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Button
          type="submit"
          color="success"
          isLoading={pending}
          disabled={!firstName || !lastName || !email || !password}
        >
          Sign up
        </Button>
      </div>
      <div className={styles.links}>
        <div className={styles.row}>
          Already have an account?
          {' '}
          <Link to={routes.signIn.url()}>
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}

export default React.memo(SignUp);
