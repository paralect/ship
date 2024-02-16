import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { TextInput, PasswordInput, Button, Group, Stack, Title, Alert, Anchor } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';
import { RoutePath } from 'routes';
import config from 'config';

import { EMAIL_REGEX } from 'app-constants';

import { GoogleIcon } from 'public/icons';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

type SignInParams = z.infer<typeof schema> & { credentials?: string };

const SignIn: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInParams>({ resolver: zodResolver(schema) });

  const { mutate: signIn, isPending: isSignInPending } = accountApi.useSignIn<SignInParams>();

  const onSubmit = (data: SignInParams) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Stack w={400} gap={20}>
        <Stack gap={32}>
          <Title order={1}>Sign In</Title>

          <form onSubmit={handleSubmit(onSubmit)}>
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

              {errors.credentials && (
                <Alert icon={<IconAlertCircle />} color="red">
                  {errors.credentials.message}
                </Alert>
              )}

              <Anchor
                component={Link}
                href={RoutePath.ForgotPassword}
              >
                Forgot password?
              </Anchor>
            </Stack>

            <Button
              type="submit"
              loading={isSignInPending}
              fullWidth
              mt={32}
            >
              Sign in
            </Button>
          </form>
        </Stack>

        <Stack gap={32}>
          <Button
            component="a"
            variant="outline"
            leftSection={<GoogleIcon />}
            href={`${config.API_URL}/account/sign-in/google/auth`}
          >
            Continue with Google
          </Button>

          <Group justify="center" gap={12}>
            Don’t have an account?
            <Anchor
              component={Link}
              href={RoutePath.SignUp}
            >
              Sign up
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignIn;
