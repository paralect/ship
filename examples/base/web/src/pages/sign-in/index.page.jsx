import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { TextInput, PasswordInput, Button, Group, Stack, Title } from '@mantine/core';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Link } from 'components';
import { accountApi } from 'resources/account';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().required('Field is required.'),
});

const SignIn = () => {
  const {
    register, handleSubmit, formState: { errors }, setError,
  } = useForm({ resolver: yupResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn();

  const onSubmit = (data) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Sign In</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Email"
              error={errors?.email?.message}
            />
            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Password"
              error={errors?.password?.message}
            />
            <Button
              loading={isSignInLoading}
              type="submit"
              fullWidth
            >
              Sign in
            </Button>
            <Group sx={{ fontSize: '14px' }}>
              Don’t have an account?
              <Link
                type="router"
                href={routes.path.signUp}
                underline={false}
                inherit
              >
                Sign up
              </Link>
            </Group>
            <Link
              href={routes.path.forgotPassword}
              type="router"
              underline={false}
              size="sm"
              align="center"
            >
              Forgot password?
            </Link>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default SignIn;
