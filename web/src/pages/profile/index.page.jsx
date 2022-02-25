import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';

import { handleError } from 'helpers';
import { Input, Button } from 'components';
import { userApi } from 'resources/user';

import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().matches(/^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

const Profile = () => {
  const queryClient = useQueryClient();

  const { data: currentUser } = userApi.useGetCurrent();

  const {
    handleSubmit, formState: { errors }, setError, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: updateCurrent, isLoading: isUpdateCurrentLoading } = userApi.useUpdateCurrent();

  const onSubmit = ({ password }) => updateCurrent({ password }, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      toast.success('Your password have been successfully updated.');
    },
    onError: (e) => handleError(e, setError),
  });

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
              defaultValue={currentUser.email}
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
              loading={isUpdateCurrentLoading}
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
