import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Head from 'next/head';

import config from 'config';
import * as routes from 'routes';
import { useHandleError } from 'hooks';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/Input';
import Button from 'components/Button';
import Link from 'components/Link';

import styles from './styles.module.css';

const schema = yup.object().shape({
  firstName: yup.string().max(100).required('Field is required.'),
  lastName: yup.string().max(100).required('Field is required.'),
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().matches(
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

const SignUp = () => {
  const handleError = useHandleError();
  const dispatch = useDispatch();

  const [values, setValues] = useState({});
  const [registered, setRegistered] = useState(false);

  const [signupToken, setSignupToken] = useState();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit, setError, formState: { errors }, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await dispatch(userActions.signUp(data));

      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setValues(data);
    } catch (e) {
      handleError(e, setError);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <div className={styles.registeredContainer}>
          <h2>Thanks!</h2>
          <div className={styles.registeredDescription}>
            Please follow the instructions from the email to complete a sign up process.
            We sent an email with a confirmation link to
            {' '}
            <b>{values.email}</b>
          </div>
          {signupToken && (
            <div>
              You look like a cool developer.
              {' '}
              <Link size="l" href={`${config.apiUrl}/account/verify-email?token=${signupToken}`}>
                Verify email
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className={styles.container}>
        <h2>Sign Up</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Input
            name="firstName"
            label="First Name"
            maxLength="100"
            placeholder="Your first name"
            control={control}
            error={errors.firstName}
          />
          <Input
            name="lastName"
            label="Last Name"
            maxLength="100"
            placeholder="Your last name"
            control={control}
            error={errors.lastName}
          />
          <Input
            name="email"
            label="Email Address"
            placeholder="Your email"
            control={control}
            error={errors.email}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Your password"
            control={control}
            error={errors.password}
          />
          <Button
            htmlType="submit"
            loading={loading}
            className={styles.button}
          >
            Sign Up
          </Button>
        </form>
        <div className={styles.description}>
          Have an account?
          <Link
            type="router"
            href={routes.path.signIn}
            className={styles.link}
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
