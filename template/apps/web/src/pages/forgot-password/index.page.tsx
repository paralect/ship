import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { Anchor, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';
import { RoutePath } from 'routes';

import { EMAIL_REGEX } from 'app-constants';
import Link from 'next/link';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
});

type ForgotPasswordParams = {
  email: string,
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
  } = accountApi.useForgotPassword<ForgotPasswordParams>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordParams>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: ForgotPasswordParams) => forgotPassword(data, {
    onSuccess: () => setEmail(data.email),
    onError: (e) => handleError(e),
  });

  if (email) {
    return (
      <>
        <Head>
          <title>Forgot password</title>
        </Head>
        <Stack w={328}>
          <Title order={2}>Reset link has been sent</Title>

          <Text>
            A link to reset your password has just been sent to
            {' '}
            <Text fw={600} span>{email}</Text>
            . Please check your email inbox and follow the
            directions to reset your password.
          </Text>

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
        <title>Forgot password</title>
      </Head>

      <Stack w={400} fz={18} gap={24}>
        <Title order={1}>Forgot Password</Title>

        <Text m={0}>
          Please enter your email and we&apos;ll send a link to reset your password.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={34}>
            <TextInput
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email address"
              error={errors.email?.message}
            />

            <Button
              type="submit"
              loading={isForgotPasswordPending}
            >
              Send reset link
            </Button>
          </Stack>
        </form>

        <Group justify="center">
          Have an account?
          <Anchor
            component={Link}
            href={RoutePath.SignIn}
          >
            Sign in
          </Anchor>
        </Group>
      </Stack>
    </>
  );
};

export default ForgotPassword;
