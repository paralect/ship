import React, { NextPage } from 'next';
import Head from 'next/head';
import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import pickBy from 'lodash/pickBy';
import { useForm } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { updateUserSchema } from 'schemas';
import { UpdateUserParams } from 'types';

import PhotoUpload from './components/PhotoUpload';

const Profile: NextPage = () => {
  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserParams>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: account?.firstName,
      lastName: account?.lastName,
      password: '',
    },
  });

  const { mutate: updateAccount, isPending: isUpdatePending } = accountApi.useUpdate();

  const onSubmit = (submitData: UpdateUserParams) =>
    updateAccount(pickBy(submitData), {
      onSuccess: (data) => {
        queryClient.setQueryData(['account'], data);

        showNotification({
          title: 'Success',
          message: 'Your profile has been successfully updated.',
          color: 'green',
        });

        reset(data, { keepDirtyValues: true });
        setValue('password', '');
      },
      onError: (e) => handleApiError(e, setError),
    });

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Stack w={408} m="auto" pt={48} gap={32}>
        <Title order={1}>Profile</Title>

        <PhotoUpload />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={32}>
            <Stack gap={20}>
              <TextInput
                {...register('firstName')}
                label="Enter first name"
                placeholder="First Name"
                error={errors.firstName?.message}
              />

              <TextInput
                {...register('lastName')}
                label="Last Name"
                placeholder="Enter last name"
                error={errors.lastName?.message}
              />

              <TextInput label="Email Address" value={account?.email} disabled />

              <PasswordInput
                {...register('password')}
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
              />
            </Stack>

            <Button type="submit" loading={isUpdatePending} disabled={!isDirty}>
              Update Profile
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Profile;
