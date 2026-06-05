import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authClient } from '@/services/auth-client.service';
import { passwordSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const formSchema = z.object({
  password: passwordSchema,
});

type ResetPasswordFormData = z.infer<typeof formSchema>;

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: '/reset-password' });

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsPending(true);
    setApiError(null);

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    setIsPending(false);

    if (error) {
      setApiError(error.message || 'Failed to reset password');
      return;
    }

    setIsSuccess(true);
  };

  const layout = (children: React.ReactNode) => (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2">
      <div className="relative hidden h-screen sm:block">
        <img src="/images/ship.svg" alt="App Info" className="h-full w-full object-cover object-left" />
      </div>
      <main className="flex h-screen w-full items-center justify-center px-8">{children}</main>
    </div>
  );

  if (!token) {
    return layout(
      <div className="flex w-full max-w-sm flex-col gap-2">
        <h2 className="mb-0 text-2xl font-semibold">Invalid token</h2>
        <p className="m-0 text-muted-foreground">Sorry, your token is invalid.</p>
      </div>,
    );
  }

  if (isSuccess) {
    return layout(
      <div className="flex w-full max-w-sm flex-col gap-4">
        <h2 className="text-2xl font-semibold">Password has been updated</h2>
        <p className="mt-0 text-muted-foreground">
          Your password has been updated successfully. You can now use your new password to sign in.
        </p>
        <Button onClick={() => navigate({ to: '/sign-in' })}>Back to Sign In</Button>
      </div>,
    );
  }

  return layout(
    <div className="flex w-full max-w-sm flex-col gap-4">
      <h2 className="text-2xl font-semibold">Reset Password</h2>
      <p className="mt-0 text-muted-foreground">Please choose your new password</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              {...register('password')}
              id="password"
              placeholder="Enter your new password"
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save New Password
          </Button>
        </div>
      </form>
    </div>,
  );
}
