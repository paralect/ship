import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { routes } from 'config';
import { resendEmail } from 'resources/user/user.api';
import { useHandleError } from 'hooks';

import Button from 'components/Button';

import styles from './styles.module.css';

const ForgotPassword = () => {
  const router = useRouter();
  const handleError = useHandleError();

  const { email } = router.query;

  const [loading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);

      await resendEmail({ email });

      setSent(true);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [email, handleError]);

  if (isSent) {
    return (
      <>
        <Head>
          <title>Password reset link expired</title>
        </Head>
        <div className={styles.container}>
          <h2>Reset link has been sent</h2>
          <div className={styles.description}>
            Reset link sent successfully
          </div>
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
        <title>Password reset link expired</title>
      </Head>
      <div className={styles.container}>
        <h2>Password reset link expired</h2>
        <p className={styles.subheading}>
          Sorry, your password reset link has expired. Click the button below to get a new one.
        </p>
        <Button
          onClick={onSubmit}
          loading={loading}
          className={styles.button}
        >
          Resend link to
          {' '}
          {email}
        </Button>
      </div>
    </>
  );
};

export default ForgotPassword;
