import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { TextInput, PasswordInput, Button, Group, Stack, Title, Divider, Alert } from '@mantine/core';
import { IconBrandGoogle, IconAlertCircle } from '@tabler/icons';

import config from 'config';
import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';
import { accountApi } from 'resources/account';

const schema = z.object({
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

type SignInParams = z.infer<typeof schema> & { credentials?: string };

const SignIn: NextPage = () => {
  const {
    register, handleSubmit, formState: { errors }, setError,
  } = useForm<SignInParams>({ resolver: zodResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn<SignInParams>();

  const onSubmit = (data: SignInParams) => signIn(data, {
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
              error={errors.email?.message}
            />
            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Password"
              error={errors.password?.message}
            />
            {errors!.credentials && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {errors.credentials.message}
              </Alert>
            )}
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
                href={RoutePath.SignUp}
                underline={false}
                inherit
              >
                Sign up
              </Link>
            </Group>
            <Link
              href={RoutePath.ForgotPassword}
              type="router"
              underline={false}
              size="sm"
              align="center"
            >
              Forgot password?
            </Link>
          </Stack>
        </form>
        <Divider
          label="Or"
          labelPosition="center"
        />
        <Button component="a" leftIcon={<IconBrandGoogle />} href={`${config.apiUrl}/account/sign-in/google/auth`}>
          Continue with Google
        </Button>
      </Stack>
    </>
  );
};

export default SignIn;
