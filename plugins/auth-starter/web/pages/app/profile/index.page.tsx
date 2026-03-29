import Head from 'next/head';
import { useState } from 'react';
import { queryKey, useApiForm, useApiMutation, useCurrentUser } from 'hooks';
import { isUndefined, pickBy } from 'lodash';
import { Loader2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';
import { authClient } from 'services/auth-client.service';
import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { accountUpdateSchema, passwordSchema } from 'schemas';
import type { User } from 'types';

import AvatarUpload from './components/AvatarUpload';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const getFormDefaultValues = (user?: User) => ({
  fullName: user?.fullName,
  avatar: undefined,
});

const Profile = () => {
  const { data: currentUser } = useCurrentUser();

  const methods = useApiForm(accountUpdateSchema, {
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(currentUser),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const { mutate: updateCurrentUser, isPending: isUpdatePending } = useApiMutation(apiClient.users.updateCurrent);

  const onSubmit = handleSubmit((submitData) => {
    const dataToUpdate = pickBy(submitData, (value, key) => {
      if (currentUser && (currentUser as Record<string, unknown>)[key] === value) return false;

      return !isUndefined(value);
    });

    updateCurrentUser(dataToUpdate, {
      onSuccess: (data) => {
        if (!data) return;

        queryClient.setQueryData(queryKey(apiClient.users.getCurrent), data);

        toast.success('Success', {
          description: 'Your profile has been successfully updated.',
        });

        reset(getFormDefaultValues(data), { keepValues: true });
        setValue('avatar', undefined);
      },
      onError: (e) => handleApiError(e, setError),
    });
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(newPassword);
    if (!result.success) {
      setPasswordError(result.error.issues[0].message);
      return;
    }

    setIsPasswordPending(true);
    setPasswordError(null);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    setIsPasswordPending(false);

    if (error) {
      setPasswordError(error.message || 'Failed to change password');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    toast.success('Success', {
      description: 'Your password has been changed.',
    });
  };

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="mx-auto w-full max-w-md px-4 pt-6 sm:pt-12">
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl font-bold">Profile</h1>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              <AvatarUpload />

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    {...register('fullName')}
                    id="fullName"
                    placeholder="Enter full name"
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={currentUser?.email} disabled />
                </div>
              </div>

              <Button type="submit" disabled={!isDirty || isUpdatePending}>
                {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </FormProvider>

          <div className="border-t pt-8">
            <h2 className="mb-6 text-xl font-semibold">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput
                  id="currentPassword"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

              <Button type="submit" disabled={!currentPassword || !newPassword || isPasswordPending}>
                {isPasswordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Profile;
