import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Head from 'next/head';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Input, Button } from 'components';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const schema = yup.object().shape({
  password: yup.string().matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

const ResetPassword = () => {
  const router = useRouter();

  const { token } = router.query;
  const [isSubmitted, setSubmitted] = useState(false);

  const {
    handleSubmit, formState: { errors }, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    mutate: resetPassword,
    isLoading: isResetPasswordLoading,
  } = accountApi.useResetPassword();

  const onSubmit = ({ password }) => resetPassword({ password, token }, {
    onSuccess: () => setSubmitted(true),
    onError: (e) => handleError(e),
  });

  if (!token) {
    return (
      <div className={styles.invalidTokenContainer}>
        <h2>Invalid token</h2>
        <p>Sorry, your token is invalid.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Reset Password</title>
        </Head>
        <div className={styles.container}>
          <h2>Password has been updated</h2>
          <p className={styles.subheading}>
            Your password has been updated successfully.
            You can now use your new password to sign in.
          </p>
          <Button onClick={() => router.push(routes.path.signIn)}>
            Back to Sign In
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <div className={styles.container}>
        <h2>Reset Password</h2>
        <p className={styles.subheading}>Please choose your new password</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Your new password"
            control={control}
            error={errors.password}
          />
          <Button
            htmlType="submit"
            loading={isResetPasswordLoading}
            className={styles.button}
          >
            Save New Password
          </Button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
