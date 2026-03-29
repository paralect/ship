import { FC } from 'react';
import { queryKey, useApiForm, useApiMutation } from 'hooks';
import { isUndefined, pickBy } from 'lodash';
import { Loader2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import queryClient from 'query-client';

import { accountUpdateSchema } from 'schemas';
import type { User } from 'types';

import AvatarUpload from '../AvatarUpload';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const getFormDefaultValues = (user?: User) => ({
  fullName: user?.fullName,
  avatar: undefined,
});

interface ProfileTabProps {
  currentUser: User;
}

const ProfileTab: FC<ProfileTabProps> = ({ currentUser }) => {
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
      if ((currentUser as Record<string, unknown>)[key] === value) return false;
      return !isUndefined(value);
    });

    updateCurrentUser(dataToUpdate, {
      onSuccess: (data) => {
        if (!data) return;

        queryClient.setQueryData(queryKey(apiClient.users.getCurrent), data);

        toast.success('Your profile has been updated.');

        reset(getFormDefaultValues(data), { keepValues: true });
        setValue('avatar', undefined);
      },
      onError: (e) => handleApiError(e, setError),
    });
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <AvatarUpload />

              <div className="flex flex-col gap-4">
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
                  <Input id="email" value={currentUser.email} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || isUpdatePending}>
                  {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
