import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { TextInput, PasswordInput, Button, Group, Stack, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { accountApi } from 'resources/account';

import config from 'config';
import { handleError } from 'utils';
import { RoutePath } from 'routes';
import { Link } from 'components';

import { EMAIL_REGEX } from 'app-constants';

import { GoogleIcon } from 'public/icons';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

type SignInParams = z.infer<typeof schema> & { credentials?: string };

const SignIn: NextPage = () => {
  const {
    register, handleSubmit, formState: { errors }, setError,
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
      <Stack w={408} gap={20}>
        <Stack gap={34}>
          <Title order={1}>Sign In</Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={20}>
              <TextInput
                {...register('email')}
                label="Email Address"
                placeholder="Email Address"
                error={errors.email?.message}
              />

              <PasswordInput
                {...register('password')}
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
              />

              {errors!.credentials && (
                <Alert icon={<IconAlertCircle size={16} />} color="red">
                  {errors.credentials.message}
                </Alert>
              )}

              <Link
                href={RoutePath.ForgotPassword}
                type="router"
                underline={false}
                size="md"
                align="center"
              >
                Forgot password?
              </Link>
            </Stack>

            <Button
              loading={isSignInPending}
              type="submit"
              fullWidth
              mt={34}
            >
              Sign in
            </Button>
          </form>
        </Stack>

        <Stack gap={34}>
          <Button
            component="a"
            leftSection={<GoogleIcon />}
            href={`${config.API_URL}/account/sign-in/google/auth`}
            variant="outline"
          >
            Continue with Google
          </Button>

          <Group fz={16} justify="center" gap={12}>
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
        </Stack>
      </Stack>
    </>
  );
};

export default SignIn;
