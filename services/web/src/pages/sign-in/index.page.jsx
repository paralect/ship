import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { TextInput, PasswordInput, Button } from '@mantine/core';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Input, Link, MemoCard } from 'components';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().required('Field is required.'),
});

const SignIn = () => {
  const {
    register, handleSubmit, formState: { errors }, setError, control,
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
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <TextInput
            {...register('email')}
            label="Email Address"
            labelProps={{
              'data-invalid': !!errors.email,
            }}
            placeholder="Email"
            error={errors?.email?.message}
          />
          <PasswordInput
            {...register('password')}
            label="Password"
            labelProps={{
              'data-invalid': !!errors.password,
            }}
            placeholder="Password"
            error={errors?.password?.message}
          />
          <Button
            loading={isSignInLoading}
            loaderProps={{
              size: 'sm',
            }}
            type="submit"
            fullWidth
          >
            Sign in
          </Button>
          <div className={styles.description}>
            <div>
              Don’t have an account?
              <Link
                type="router"
                href={routes.path.signUp}
                className={styles.signUplink}
              >
                Sign up
              </Link>
            </div>
            <Link
              type="router"
              href={routes.path.forgotPassword}
              className={styles.forgotPasswordLink}
            >
              Forgot password?
            </Link>
          </div>
        </form>
        <MemoCard items={errors.credentials} />
      </div>
    </>
  );
};

export default SignIn;
