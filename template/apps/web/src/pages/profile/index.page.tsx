import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Title,
} from '@mantine/core';

import { handleError } from 'utils';
import { userApi } from 'resources/user';

import PhotoUpload from './components/file-upload';

const schema = z.object({
  password: z.string().regex(
    /^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

type UpdateCurrentParams = z.infer<typeof schema>;

const Profile: NextPage = () => {
  const queryClient = useQueryClient();

  const { data: currentUser } = userApi.useGetCurrent();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateCurrentParams>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: updateCurrent,
    isLoading: isUpdateCurrentLoading,
  } = userApi.useUpdateCurrent<UpdateCurrentParams>();

  const onSubmit = (submitData: UpdateCurrentParams) => updateCurrent(submitData, {
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
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            label="Email Address"
            defaultValue={currentUser?.email}
            disabled
          />
          <PasswordInput
            {...register('password')}
            label="Password"
            placeholder="Your password"
            labelProps={{
              'data-invalid': !!errors.password,
            }}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            loading={isUpdateCurrentLoading}
          >
            Update Profile
          </Button>
        </form>
      </Stack>
    </>
  );
};

export default Profile;
