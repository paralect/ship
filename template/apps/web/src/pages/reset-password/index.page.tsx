import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { handleApiError } from 'utils';

import { RoutePath } from 'routes';

import { resetPasswordSchema } from 'schemas';
import { ResetPasswordParams } from 'types';

const schema = resetPasswordSchema.omit({ token: true });

const ResetPassword: NextPage = () => {
  const [isSubmitted, setSubmitted] = useState(false);
  const router = useRouter();

  const { token } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordParams>({ resolver: zodResolver(schema) });

  const { mutate: resetPassword, isPending: isResetPasswordPending } = accountApi.useResetPassword();

  const onSubmit = (data: ResetPasswordParams) => {
    if (typeof token !== 'string') return;

    resetPassword(
      {
        ...data,
        token,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (e) => handleApiError(e),
      },
    );
  };

  if (!token) {
    return (
      <Stack w={328} gap="xs">
        <Title order={2} mb={0}>
          Invalid token
        </Title>

        <Text m={0}>Sorry, your token is invalid.</Text>
      </Stack>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Reset Password</title>
        </Head>

        <Stack w={328}>
          <Title order={2}>Password has been updated</Title>

          <Text mt={0}>Your password has been updated successfully. You can now use your new password to sign in.</Text>

          <Button onClick={() => router.push(RoutePath.SignIn)}>Back to Sign In</Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>

      <Stack w={328}>
        <Title order={2}>Reset Password</Title>

        <Text mt={0}>Please choose your new password</Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={20}>
            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Enter your new password"
              error={errors.password?.message}
            />

            <Button type="submit" loading={isResetPasswordPending}>
              Save New Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default ResetPassword;
