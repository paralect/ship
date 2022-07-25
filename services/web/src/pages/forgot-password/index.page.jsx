import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Head from 'next/head';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Link } from 'components';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { accountApi } from 'resources/account';

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
    register,
    handleSubmit,
    formState: { errors },
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
        <Stack sx={{ width: '328px' }}>
          <Title order={2}>Reset link has been sent</Title>
          <Text component="p">
            A link to reset your password has just been sent to
            {' '}
            <b>{email}</b>
            . Please check your email inbox and follow the
            directions to reset your password.
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
        <title>Forgot password</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2} sx={{ marginBottom: 0 }}>Forgot Password</Title>
        <Text component="p">
          Please enter your email and we&apos;ll send
          a link to reset your password.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              {...register('email')}
              type="email"
              label="Email address"
              labelProps={{
                'data-invalid': !!errors.email,
              }}
              placeholder="Your email address"
              error={errors?.email?.message}
            />
            <Button
              type="submit"
              loading={isForgotPasswordLoading}
            >
              Send reset link
            </Button>
          </Stack>
        </form>
        <Group sx={{ fontSize: '14px' }}>
          Have an account?
          <Link
            type="router"
            href={routes.path.signIn}
            inherit
          >
            Sign in
          </Link>
        </Group>
      </Stack>
    </>
  );
};

export default ForgotPassword;
