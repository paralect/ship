import { NextPage } from 'next';
import Head from 'next/head';
import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useApiForm, useApiMutation, useApiQuery } from 'hooks';
import { isUndefined, pickBy } from 'lodash';
import { serialize } from 'object-to-formdata';
import { FormProvider } from 'react-hook-form';
import { AccountGetResponse, schemas } from 'shared';
import { z } from 'zod';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import queryClient from 'query-client';

import AvatarUpload from './components/AvatarUpload';

const getFormDefaultValues = (account?: AccountGetResponse) => ({
  firstName: account?.firstName,
  lastName: account?.lastName,
  password: '',
  avatar: undefined,
});

const Profile: NextPage = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  const methods = useApiForm(apiClient.account.update, {
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

  const { mutate: updateAccount, isPending: isUpdatePending } = useApiMutation(apiClient.account.update);

  const onSubmit = handleSubmit((submitData) => {
    const updateData = pickBy(submitData, (value, key) => {
      if (account && (account as Record<string, unknown>)[key] === value) return false;
      if (key === 'password' && value === '') return false;

      return !isUndefined(value);
    });

    updateAccount(serialize(updateData) as unknown as z.infer<typeof schemas.account.update>, {
      onSuccess: (data) => {
        queryClient.setQueryData([apiClient.account.get.path], data);

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
  });

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Stack w={408} m="auto" pt={48} gap={32}>
        <Title order={1}>Profile</Title>

        <FormProvider {...methods}>
          <Stack component="form" onSubmit={onSubmit} gap={32}>
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
