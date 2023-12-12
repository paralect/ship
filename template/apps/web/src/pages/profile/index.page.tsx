import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';
import { NextPage } from 'next';
import { Button, TextInput, PasswordInput, Stack, Title } from '@mantine/core';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';
import queryClient from 'query-client';

import PhotoUpload from './components/PhotoUpload';

import classes from './index.module.css';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  password: z.string().regex(
    /^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

type UpdateParams = z.infer<typeof schema>;

const Profile: NextPage = () => {
  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: account?.firstName,
      lastName: account?.lastName,
    },
  });

  const {
    mutate: updateAccount,
    isPending: isUpdatePending,
  } = accountApi.useUpdate<UpdateParams>();

  const onSubmit = (submitData: UpdateParams) => updateAccount(submitData, {
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
      showNotification({
        title: 'Success',
        message: 'Your profile has been successfully updated.',
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
        w={408}
        m="auto"
        pt={48}
        gap={32}
      >
        <Title order={1}>Profile</Title>
        <PhotoUpload />

        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack gap={20}>
            <TextInput
              {...register('firstName')}
              label="First Name"
              placeholder="First Name"
              labelProps={{
                'data-invalid': !!errors.firstName,
              }}
              error={errors.firstName?.message}
            />

            <TextInput
              {...register('lastName')}
              label="Last Name"
              placeholder="Last Name"
              labelProps={{
                'data-invalid': !!errors.lastName,
              }}
              error={errors.lastName?.message}
            />

            <TextInput
              label="Email Address"
              defaultValue={account?.email}
              disabled
            />

            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Enter password"
              labelProps={{
                'data-invalid': !!errors.password,
              }}
              error={errors.password?.message}
            />
          </Stack>

          <Button
            type="submit"
            loading={isUpdatePending}
          >
            Update Profile
          </Button>
        </form>
      </Stack>
    </>
  );
};

export default Profile;
