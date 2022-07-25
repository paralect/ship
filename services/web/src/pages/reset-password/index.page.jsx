import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  Title,
  Text,
  Button,
  PasswordInput,
} from '@mantine/core';
import Head from 'next/head';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { accountApi } from 'resources/account';

const schema = yup.object().shape({
  password: yup.string().matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

const ResetPassword = () => {
  const router = useRouter();

  const { token } = router.query;
  const [isSubmitted, setSubmitted] = useState(false);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    mutate: resetPassword,
    isLoading: isResetPasswordLoading,
  } = accountApi.useResetPassword();

  const onSubmit = ({ password }) => resetPassword({ password, token }, {
    onSuccess: () => setSubmitted(true),
    onError: (e) => handleError(e),
  });

  if (!token) {
    return (
      <Stack sx={{ width: '328px' }} spacing="xs">
        <Title order={2} mb={0}>Invalid token</Title>
        <Text component="p" m={0}>Sorry, your token is invalid.</Text>
      </Stack>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Reset Password</title>
        </Head>
        <Stack sx={{ width: '328px' }}>
          <Title order={2}>Password has been updated</Title>
          <Text component="p" mt={0}>
            Your password has been updated successfully.
            You can now use your new password to sign in.
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
        <title>Reset Password</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Reset Password</Title>
        <Text component="p" mt={0}>Please choose your new password</Text>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
          <PasswordInput
            {...register('password')}
            type="password"
            label="Password"
            placeholder="Your new password"
            error={errors?.password?.message}
          />
          <Button
            type="submit"
            loading={isResetPasswordLoading}
            loaderProps={{ size: 'xs' }}
            fullWidth
          >
            Save New Password
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default ResetPassword;
