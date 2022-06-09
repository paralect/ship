import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Head from 'next/head';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Input, Button, Link } from 'components';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
});

const ForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState(null);

  const {
    mutate: forgotPassword,
    isLoading: isForgotPasswordLoading,
  } = accountApi.useForgotPassword();

  const {
    handleSubmit, formState: { errors }, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => forgotPassword(data, {
    onSuccess: () => setEmail(data.email),
    onError: (e) => handleError(e),
  });

  if (email) {
    return (
      <>
        <Head>
          <title>Forgot password</title>
        </Head>
        <div className={styles.container}>
          <h2>Reset link has been sent</h2>
          <p className={styles.subheading}>
            A link to reset your password has just been sent to
            {' '}
            <b>{email}</b>
            . Please check your email inbox and follow the
            directions to reset your password.
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
        <title>Forgot password</title>
      </Head>
      <div className={styles.container}>
        <h2>Forgot Password</h2>
        <p className={styles.subheading}>
          Please enter your email and we&apos;ll send
          a link to reset your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            type="email"
            label="Email address"
            placeholder="Your email address"
            control={control}
            error={errors.email}
          />
          <Button
            htmlType="submit"
            loading={isForgotPasswordLoading}
            className={styles.button}
          >
            Send reset link
          </Button>
        </form>
        <div className={styles.description}>
          Have an account?
          <Link
            type="router"
            href={routes.path.signIn}
            className={styles.signInLink}
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
