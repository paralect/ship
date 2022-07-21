import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';

import { handleError } from 'helpers';
import {
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Title,
} from '@mantine/core';
import { userApi } from 'resources/user';

import PhotoUpload from './components/file-upload';

const schema = yup.object().shape({
  password: yup.string().matches(/^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

const Profile = () => {
  const queryClient = useQueryClient();

  const { data: currentUser } = userApi.useGetCurrent();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: updateCurrent, isLoading: isUpdateCurrentLoading } = userApi.useUpdateCurrent();

  const onSubmit = ({ password }) => updateCurrent({ password }, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      showNotification({
        title: 'Success',
        message: 'Your password have been successfully updated.',
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Stack
        sx={{ width: '328px', margin: 'auto', paddingTop: '48px' }}
        spacing="xl"
      >
        <Title order={1}>Profile</Title>
        <PhotoUpload />
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
          <TextInput
            {...register('email')}
            label="Email Address"
            defaultValue={currentUser.email}
            disabled
          />
          <PasswordInput
            {...register('password')}
            label="Password"
            placeholder="Your password"
            labelProps={{
              'data-invalid': !!errors.password,
            }}
            error={errors?.password?.message}
          />
          <Button
            type="submit"
            loading={isUpdateCurrentLoading}
          >
            Update Profile
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default Profile;
