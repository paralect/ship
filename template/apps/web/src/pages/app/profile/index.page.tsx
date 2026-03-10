import Head from 'next/head';
import { useApiForm, useApiMutation, useApiQuery } from 'hooks';
import { isUndefined, pickBy } from 'lodash';
import { Loader2 } from 'lucide-react';
import { serialize } from 'object-to-formdata';
import { FormProvider } from 'react-hook-form';
import { AccountGetResponse, AccountUpdateParams } from 'shared';
import { toast } from 'sonner';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import queryClient from 'query-client';

import AvatarUpload from './components/AvatarUpload';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const getFormDefaultValues = (account?: AccountGetResponse) => ({
  firstName: account?.firstName,
  lastName: account?.lastName,
  password: '',
  avatar: undefined,
});

const Profile = () => {
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

    updateAccount(serialize(updateData) as unknown as AccountUpdateParams, {
      onSuccess: (data) => {
        if (!data) return;

        queryClient.setQueryData([apiClient.account.get.path], data);

        toast.success('Success', {
          description: 'Your profile has been successfully updated.',
        });

        reset(getFormDefaultValues(data), { keepValues: true });
        setValue('password', '');
        setValue('avatar', undefined);
      },
      onError: (e) => handleApiError(e, setError),
    });
  });

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="mx-auto w-full max-w-md px-4 pt-6 sm:pt-12">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold">Profile</h1>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
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
    </Page>
  );
};

export default Profile;
