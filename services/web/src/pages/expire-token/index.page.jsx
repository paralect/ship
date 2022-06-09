import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Button } from 'components';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const ForgotPassword = () => {
  const router = useRouter();

  const { email } = router.query;

  const [isSent, setSent] = useState(false);

  const { mutate: resendEmail, isLoading: isResendEmailLoading } = accountApi.useResendEmail();

  const onSubmit = () => resendEmail({ email }, {
    onSuccess: () => setSent(true),
    onError: (e) => handleError(e),
  });

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
          loading={isResendEmailLoading}
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
