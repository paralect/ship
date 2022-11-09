import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';

import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';

import { accountApi } from 'resources/account';

const schema = z.object({
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
});

type ForgotPasswordParams = {
  email: string,
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const {
    mutate: forgotPassword,
    isLoading: isForgotPasswordLoading,
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
        <Stack sx={{ width: '328px' }}>
          <Title order={2}>Reset link has been sent</Title>
          <Text component="p">
            A link to reset your password has just been sent to
            {' '}
            <b>{email}</b>
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
      <Stack sx={{ width: '408px', fontSize: '18px' }} spacing={34}>
        <Title order={1} sx={{ marginBottom: 0 }}>Forgot Password</Title>
        <Text component="p" m={0}>
          Please enter your email and we&apos;ll send
          a link to reset your password.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={34}>
            <TextInput
              {...register('email')}
              type="email"
              label="Email address"
              labelProps={{
                'data-invalid': !!errors.email,
              }}
              placeholder="Your email address"
              error={errors.email?.message}
            />
            <Button
              type="submit"
              loading={isForgotPasswordLoading}
            >
              Send reset link
            </Button>
          </Stack>
        </form>
        <Group sx={{ fontSize: '16px', justifyContent: 'center' }}>
          Have an account?
          <Link
            type="router"
            href={RoutePath.SignIn}
            inherit
            underline={false}
          >
            Sign in
          </Link>
        </Group>
      </Stack>
    </>
  );
};

export default ForgotPassword;
