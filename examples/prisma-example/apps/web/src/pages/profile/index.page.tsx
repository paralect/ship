import { NextPage } from 'next';
import Head from 'next/head';
import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { isUndefined, pickBy } from 'lodash';
import { serialize } from 'object-to-formdata';
import { FormProvider, useForm } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { updateUserSchema } from 'schemas';
import { UpdateUserParams, User } from 'types';

import AvatarUpload from './components/AvatarUpload';

const getFormDefaultValues = (account?: User) => ({
  firstName: account?.firstName,
  lastName: account?.lastName,
  password: '',
  avatar: undefined,
});

const Profile: NextPage = () => {
  const { data: account } = accountApi.useGet();

  const methods = useForm<UpdateUserParams>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(account),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const { mutate: updateAccount, isPending: isUpdatePending } = accountApi.useUpdate<FormData>();

  const onSubmit = (submitData: UpdateUserParams) => {
    const updateData = pickBy(submitData, (value, key) => {
      if (account && account[key as keyof User] === value) return false;
      if (key === 'password' && value === '') return false;

      return !isUndefined(value);
    });

    updateAccount(serialize(updateData), {
      onSuccess: (data) => {
        queryClient.setQueryData(['account'], data);

        showNotification({
          title: 'Success',
          message: 'Your profile has been successfully updated.',
          color: 'green',
        });

        reset(getFormDefaultValues(data), { keepValues: true });
        setValue('password', '');
        setValue('avatar', undefined);
      },
      onError: (e) => handleApiError(e, setError),
    });
  };

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Stack w={408} m="auto" pt={48} gap={32}>
        <Title order={1}>Profile</Title>

        <FormProvider {...methods}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={32}>
            <AvatarUpload />

            <Stack gap={20}>
              <TextInput
                {...register('firstName')}
                label="First Name"
                placeholder="Enter first name"
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
        </FormProvider>
      </Stack>
    </>
  );
};

export default Profile;
