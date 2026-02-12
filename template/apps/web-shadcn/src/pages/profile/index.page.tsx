import { NextPage } from 'next';
import Head from 'next/head';
import { zodResolver } from '@hookform/resolvers/zod';
import { isUndefined, pickBy } from 'lodash';
import { Loader2 } from 'lucide-react';
import { serialize } from 'object-to-formdata';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { accountApi } from 'resources/account';

import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { updateUserSchema } from 'schemas';
import { UpdateUserParams, User } from 'types';

import AvatarUpload from './components/AvatarUpload';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

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

        toast.success('Success', {
          description: 'Your profile has been successfully updated.',
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

      <div className="mx-auto w-[408px] pt-12">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold">Profile</h1>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <AvatarUpload />

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    {...register('firstName')}
                    id="firstName"
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    {...register('lastName')}
                    id="lastName"
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={account?.email} disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    {...register('password')}
                    id="password"
                    placeholder="Enter password"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={!isDirty || isUpdatePending}>
                {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Profile;
