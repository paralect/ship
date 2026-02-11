import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Alert, Anchor, Button, Group, Loader, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useApiForm, useApiMutation } from 'hooks';
import { AccountGetResponse } from 'shared';

import { apiClient } from 'services/api-client.service';

import { GoogleIcon } from 'public/icons';

import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { RoutePath } from 'routes';
import config from 'config';

const SignIn: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useApiForm(apiClient.account.signIn);

  // API error fields set via setError
  const apiErrors = errors as typeof errors & {
    credentials?: { message?: string };
    emailVerificationTokenExpired?: { message?: string };
  };

  const { mutate: signIn, isPending: isSignInPending } = useApiMutation(apiClient.account.signIn, {
    onSuccess: (data: AccountGetResponse) => {
      queryClient.setQueryData([apiClient.account.get.path], data);
    },
  });
  const { mutate: resendEmail, isPending: isResendEmailPending } = useApiMutation(apiClient.account.resendEmail);

  const onSubmit = handleSubmit((data) =>
    signIn(data, {
      onError: (e) => handleApiError(e, setError),
    }),
  );

  const onResendEmail = () => {
    if (isResendEmailPending) return;

    resendEmail(
      { email: watch('email') },
      {
        onError: (e) => handleApiError(e, setError),
        onSuccess: () => {
          showNotification({
            title: 'Verification email sent',
            message: 'Please check your email to verify your account.',
            color: 'green',
          });
        },
      },
    );
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Stack w={400} gap={20}>
        <Stack gap={32}>
          <Title order={1}>Sign In</Title>

          <form onSubmit={onSubmit}>
            <Stack gap={20}>
              <TextInput
                {...register('email')}
                label="Email Address"
                placeholder="Enter email address"
                error={errors.email?.message}
              />

              <PasswordInput
                {...register('password')}
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
              />

              {apiErrors.credentials && (
                <Alert icon={<IconAlertCircle />} color="red">
                  {apiErrors.credentials.message}
                </Alert>
              )}

              {apiErrors.emailVerificationTokenExpired && (
                <Alert icon={<IconAlertCircle />} color="yellow">
                  <Stack gap={4}>
                    <Text>Please verify your email to sign in.</Text>

                    <Group gap={8}>
                      <Anchor onClick={onResendEmail} size="sm">
                        Resend verification email
                      </Anchor>

                      {isResendEmailPending && <Loader size={12} />}
                    </Group>
                  </Stack>
                </Alert>
              )}

              <Anchor component={Link} href={RoutePath.ForgotPassword}>
                Forgot password?
              </Anchor>
            </Stack>

            <Button type="submit" loading={isSignInPending} fullWidth mt={32}>
              Sign in
            </Button>
          </form>
        </Stack>

        <Stack gap={32}>
          <Button
            component="a"
            variant="outline"
            leftSection={<GoogleIcon />}
            href={`${config.API_URL}/account/sign-in/google`}
          >
            Continue with Google
          </Button>

          <Group justify="center" gap={12}>
            Don’t have an account?
            <Anchor component={Link} href={RoutePath.SignUp}>
              Sign up
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignIn;
