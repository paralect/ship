import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';

import { handleError } from 'helpers';
import {
  Button,
  TextInput,
  PasswordInput,
  Box,
  Stack,
  Title,
} from '@mantine/core';
import { userApi } from 'resources/user';

import PhotoUpload from './components/file-upload';

const schema = yup.object().shape({
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
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
      toast.success('Your password have been successfully updated.');
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Stack
        style={{ width: '328px', margin: 'auto', paddingTop: '48px' }}
        spacing="xl"
      >
        <Title order={1}>Profile</Title>
        <PhotoUpload />
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
          <TextInput
            {...register('email')}
            label="Email Address"
            defaultValue={currentUser.email}
            error={errors.email}
            disabled
          />
          <PasswordInput
            {...register('password')}
            label="Password"
            placeholder="Your password"
            error={errors.password}
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
