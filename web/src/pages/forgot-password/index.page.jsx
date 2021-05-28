import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { path } from 'pages/routes';

import { forgotPassword } from 'resources/user/user.api';

import Input from 'components/Input';
import Button from 'components/Button';
import useHandleError from 'hooks/use-handle-error';
import Link from 'components/Link';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
});

const ForgotPassword = () => {
  const router = useRouter();
  const handleError = useHandleError();

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit, formState: { errors }, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);

      await forgotPassword(data);

      setEmail(data.email);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

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
          <Button onClick={() => router.push(path.signIn)}>
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
            loading={loading}
            className={styles.button}
          >
            Send reset link
          </Button>
        </form>
        <div className={styles.description}>
          Have an account?
          <Link
            type="router"
            href={path.signIn}
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
