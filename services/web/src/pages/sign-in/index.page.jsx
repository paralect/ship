import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Input, Button, Link, MemoCard } from 'components';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().required('Field is required.'),
});

const SignIn = () => {
  const {
    handleSubmit, formState: { errors }, setError, control,
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
          <Input
            name="email"
            label="Email Address"
            placeholder="Email"
            control={control}
            error={errors.email}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            control={control}
            error={errors.password}
          />
          <Button
            className={styles.button}
            loading={isSignInLoading}
            htmlType="submit"
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
