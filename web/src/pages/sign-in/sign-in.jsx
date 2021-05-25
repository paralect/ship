import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/input';
import Button from 'components/button';

import styles from './sign-in.pcss';

function SignIn() {
  const user = useSelector(userSelectors.selectUser);

  const dispatch = useDispatch();

  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function submit(event) {
    event.preventDefault();

    try {
      setPending(true);
      await dispatch(userActions.signIn({ email, password }));
    } catch (error) {
      setErrors(error.data.errors);
      setPending(false);
    }
  }

  if (user) {
    const redirectPath = new URLSearchParams(window.location.search).get('to');

    return <Redirect to={redirectPath || routes.home.url()} />;
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={styles.container}
    >
      <h1 className={styles.title}>
        Sign In
      </h1>
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
          disabled={!email || !password}
        >
          Sign in
        </Button>
      </div>
      <div className={styles.links}>
        <div className={styles.row}>
          Don’t have an account?
          {' '}
          <Link to={routes.signUp.url()}>
            Sign up
          </Link>
        </div>
        <div className={styles.row}>
          <Link to={routes.forgot.url()}>
            Forgot password?
          </Link>
        </div>
      </div>
    </form>
  );
}

export default React.memo(SignIn);
