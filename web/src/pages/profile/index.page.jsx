import * as yup from 'yup';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Head from 'next/head';

import { useHandleError, useToast } from 'hooks';
import { updateCurrent } from 'resources/user/user.api';
import { userSelectors } from 'resources/user/user.slice';

import Input from 'components/Input';
import Button from 'components/Button';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().matches(/^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

const Profile = () => {
  const handleError = useHandleError();
  const { toastSuccess } = useToast();

  const [loading, setLoading] = useState(false);

  const { email } = useSelector(userSelectors.selectUser);

  const {
    handleSubmit, formState: { errors }, setError, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async ({ password }) => {
    try {
      setLoading(true);

      await updateCurrent({ password });

      toastSuccess('Your password have been successfully updated.');
    } catch (e) {
      handleError(e, setError);
    } finally {
      setLoading(false);
    }
  }, [toastSuccess, handleError, setError]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className={styles.uploadContainer}>
        <span>
          <h1 className={styles.heading}>Profile</h1>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="email"
              label="Email Address"
              defaultValue={email}
              control={control}
              error={errors.email}
              disabled
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
            >
              Update Profile
            </Button>
          </form>
        </span>
      </div>
    </>
  );
};

export default Profile;
