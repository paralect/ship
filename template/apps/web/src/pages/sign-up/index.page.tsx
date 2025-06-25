import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Anchor, Button, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { GoogleIcon } from 'public/icons';

import { handleApiError } from 'utils';

import { RoutePath } from 'routes';
import config from 'config';

import { signUpSchema } from 'schemas';
import { SignUpParams } from 'types';

import PasswordRules from './components/PasswordRules';

const SignUp: NextPage = () => {
  const methods = useForm<SignUpParams>({ resolver: zodResolver(signUpSchema) });
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const emailValue = watch('email');

  const {
    mutate: signUp,
    isPending: isSignUpPending,
    isSuccess: isSignUpSuccess,
    data: signUpData,
  } = accountApi.useSignUp();

  const onSubmit = (data: SignUpParams) =>
    signUp(data, {
      onError: (e) => handleApiError(e, setError),
    });

  if (isSignUpSuccess) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>

        <Stack w={450}>
          <Title order={2}>Thanks!</Title>

          <Text size="md" c="gray.6">
            Please follow the instructions from the email to complete a sign up process. We sent an email with a
            confirmation link to{' '}
            <Text fw={600} span>
              {emailValue}
            </Text>
          </Text>

          {signUpData?.emailVerificationToken && (
            <Stack gap={4}>
              <Text>You look like a cool developer 🧑‍💻</Text>

              <Anchor
                size="sm"
                href={`${config.API_URL}/account/verify-email?token=${signUpData.emailVerificationToken}`}
                target="_blank"
              >
                Verify email
              </Anchor>
            </Stack>
          )}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>

      <FormProvider {...methods}>
        <Stack w={400} gap={20}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={32}>
            <Title order={1}>Sign Up</Title>

            <Stack gap={24}>
              <TextInput
                {...register('firstName')}
                label="First Name"
                maxLength={100}
                placeholder="Enter first Name"
                error={errors.firstName?.message}
              />

              <TextInput
                {...register('lastName')}
                label="Last Name"
                maxLength={100}
                placeholder="Enter last Name"
                error={errors.lastName?.message}
              />

              <TextInput
                {...register('email')}
                label="Email Address"
                placeholder="Enter email Address"
                error={errors.email?.message}
              />

              <PasswordRules
                render={({ onFocus, onBlur }) => (
                  <PasswordInput
                    {...register('password')}
                    label="Password"
                    placeholder="Enter password"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />
            </Stack>

            <Button type="submit" loading={isSignUpPending} fullWidth mt={32}>
              Sign Up
            </Button>
          </Stack>

          <Stack gap={32}>
            <Button
              component="a"
              leftSection={<GoogleIcon />}
              href={`${config.API_URL}/account/sign-in/google`}
              variant="outline"
            >
              Continue with Google
            </Button>

            <Group justify="center" gap={12}>
              Have an account?
              <Anchor component={Link} href={RoutePath.SignIn}>
                Sign In
              </Anchor>
            </Group>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
};

export default SignUp;
