import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/input';
import Button from 'components/button';
import Form from 'components/form';

import styles from './reset.pcss';

function Reset() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const [pending, setPending] = React.useState(false);

  const handleSubmit = async (submitValues) => {
    setPending(true);
    await dispatch(userActions.reset(submitValues));
    setPending(false);
  };

  if (!token) {
    return (
      <Redirect to={routes.notFound.url()} />
    );
  }

  if (user) {
    return <Redirect to={routes.home.url()} />;
  }

  return (
    <Form
      onSubmit={handleSubmit}
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
          name="password"
          label="Password"
          placeholder="New Password"
          disabled={pending}
        />
      </div>
      <div className={styles.row}>
        <Button
          htmlType="submit"
          isLoading={pending}
        >
          Save New Password
        </Button>
      </div>
    </Form>
  );
}

export default React.memo(Reset);
