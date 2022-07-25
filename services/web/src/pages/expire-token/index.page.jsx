import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { accountApi } from 'resources/account';
import {
  Stack,
  Title,
  Text,
  Button,
} from '@mantine/core';

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
        <Stack sx={{ width: '328px' }}>
          <Title order={2}>Reset link has been sent</Title>
          <Text component="p" sx={{ fontSize: '14px' }}>
            Reset link sent successfully
          </Text>
          <Button onClick={() => router.push(routes.path.signIn)}>
            Back to Sign In
          </Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Password reset link expired</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Password reset link expired</Title>
        <Text component="p" mt={0}>
          Sorry, your password reset link has expired. Click the button below to get a new one.
        </Text>
        <Button
          onClick={onSubmit}
          loading={isResendEmailLoading}
          fullWidth
        >
          Resend link to
          {' '}
          {email}
        </Button>
      </Stack>
    </>
  );
};

export default ForgotPassword;
