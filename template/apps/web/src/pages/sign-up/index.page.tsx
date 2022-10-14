import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { IconBrandGoogle } from '@tabler/icons';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Title,
  Text,
  Checkbox,
  SimpleGrid,
  Tooltip,
  Divider,
} from '@mantine/core';

import config from 'config';
import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';
import { accountApi } from 'resources/account';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

type SignUpParams = z.infer<typeof schema>;

const passwordRules = [
  {
    title: 'Be 6-50 characters',
    done: false,
  },
  {
    title: 'Have at least one letter',
    done: false,
  },
  {
    title: 'Have at least one number',
    done: false,
  },
];

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signupToken, setSignupToken] = useState();

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);
  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 6 && passwordValue.length <= 50;
    updatedPasswordRulesData[1].done = /[a-z]/.test(passwordValue);
    updatedPasswordRulesData[2].done = /\d/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setEmail(data.email);
    },
    onError: (e) => handleError(e, setError),
  });

  const label = (
    <SimpleGrid
      cols={1}
      spacing="xs"
    >
      <Text>Password must:</Text>
      {passwordRulesData.map((ruleData) => (
        <Checkbox
          styles={{ label: { color: 'white' } }}
          key={ruleData.title}
          checked={!!ruleData.done}
          label={ruleData.title}
        />
      ))}
    </SimpleGrid>
  );

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <Stack sx={{ width: '450px' }}>
          <Title order={2}>Thanks!</Title>
          <Text size="md" sx={({ colors }) => ({ color: colors.gray[5] })}>
            Please follow the instructions from the email to complete a sign up process.
            We sent an email with a confirmation link to
            {' '}
            <b>{email}</b>
          </Text>
          {signupToken && (
            <div>
              You look like a cool developer.
              {' '}
              <Link size="sm" href={`${config.apiUrl}/account/verify-email?token=${signupToken}`}>
                Verify email
              </Link>
            </div>
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
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Sign Up</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              {...register('firstName')}
              label="First Name"
              maxLength={100}
              placeholder="Your first name"
              error={errors.firstName?.message}
            />
            <TextInput
              {...register('lastName')}
              label="Last Name"
              maxLength={100}
              placeholder="Your last name"
              error={errors.lastName?.message}
            />
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Your email"
              error={errors.email?.message}
            />
            <Tooltip
              label={label}
              withArrow
              opened={opened}
            >
              <PasswordInput
                {...register('password')}
                label="Password"
                placeholder="Your password"
                onFocus={() => setOpened(true)}
                onBlur={() => setOpened(false)}
                error={errors.password?.message}
              />
            </Tooltip>
            <Button
              type="submit"
              loading={isSignUpLoading}
              fullWidth
            >
              Sign Up
            </Button>
          </Stack>
        </form>
        <Group sx={{ fontSize: '14px' }}>
          Have an account?
          <Link
            type="router"
            href={RoutePath.SignIn}
            inherit
            underline={false}
          >
            Sign In
          </Link>
        </Group>
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

export default SignUp;
