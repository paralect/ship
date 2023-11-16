import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack, Title, Text, Button } from '@mantine/core';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';
import { RoutePath } from 'routes';

import { QueryParam } from 'types';

type ForgotPasswordParams = {
  email: QueryParam,
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const { email } = router.query;

  const [isSent, setSent] = useState(false);

  const {
    mutate: resendEmail,
    isPending: isResendEmailPending,
  } = accountApi.useResendEmail<ForgotPasswordParams>();

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
        <Stack w={328}>
          <Title order={2}>Reset link has been sent</Title>
          <Text fz={14}>Reset link sent successfully</Text>

          <Button onClick={() => router.push(RoutePath.SignIn)}>
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
      <Stack w={328}>
        <Title order={2}>Password reset link expired</Title>

        <Text mt={0}>
          Sorry, your password reset link has expired. Click the button below to get a new one.
        </Text>

        <Button
          loading={isResendEmailPending}
          fullWidth
          onClick={onSubmit}
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
