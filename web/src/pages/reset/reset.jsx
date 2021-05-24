import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/input';
import Button from 'components/button';

import styles from './reset.pcss';

function Reset() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [password, setPassword] = React.useState('');

  async function submit(event) {
    event.preventDefault();

    try {
      setPending(true);
      await dispatch(userActions.reset({ password, token }));
    } catch (error) {
      setErrors(error.data.errors);
      setPending(false);
    }
  }

  if (!token) {
    return (
      <Redirect to={routes.notFound.url()} />
    );
  }

  if (user) {
    return <Redirect to={routes.home.url()} />;
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={styles.container}
    >
      <h1 className={styles.title}>
        Reset Password
      </h1>
      <p className={styles.description}>
        Please choose your new password
      </p>
      <div className={styles.row}>
        <Input
          type="password"
          value={password}
          onChange={setPassword}
          errors={errors.password}
          placeholder="New Password"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Button
          type="submit"
          color="success"
          isLoading={pending}
          disabled={!password}
        >
          Save New Password
        </Button>
      </div>
    </form>
  );
}

export default React.memo(Reset);
