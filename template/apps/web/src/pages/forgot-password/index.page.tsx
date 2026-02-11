import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Anchor, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useApiForm, useApiMutation } from 'hooks';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import { RoutePath } from 'routes';

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
    isSuccess: isForgotPasswordSuccess,
  } = useApiMutation(apiClient.account.forgotPassword);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useApiForm(apiClient.account.forgotPassword);

  const email = watch('email');

  const onSubmit = handleSubmit((data) =>
    forgotPassword(data, {
      onError: (e) => handleApiError(e, setError),
    }),
  );

  if (isForgotPasswordSuccess && email) {
    return (
      <>
        <Head>
          <title>Forgot password</title>
        </Head>
        <Stack w={328}>
          <Title order={2}>Reset link has been sent</Title>

          <Text>
            A link to reset your password has just been sent to{' '}
            <Text fw={600} span>
              {email}
            </Text>
            . Please check your email inbox and follow the directions to reset your password.
          </Text>

          <Button onClick={() => router.push(RoutePath.SignIn)}>Back to Sign In</Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forgot password</title>
      </Head>

      <Stack w={400} fz={18} gap={24}>
        <Title order={1}>Forgot Password</Title>

        <Text m={0}>Please enter your email and we&apos;ll send a link to reset your password.</Text>

        <form onSubmit={onSubmit}>
          <Stack gap={34}>
            <TextInput
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email address"
              error={errors.email?.message}
            />

            <Button type="submit" loading={isForgotPasswordPending}>
              Send reset link
            </Button>
          </Stack>
        </form>

        <Group justify="center">
          Have an account?
          <Anchor component={Link} href={RoutePath.SignIn}>
            Sign in
          </Anchor>
        </Group>
      </Stack>
    </>
  );
};

export default ForgotPassword;
