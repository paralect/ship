import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useApiForm } from '@/hooks';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/services/auth-client.service';
import { forgotPasswordSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useApiForm(forgotPasswordSchema);

  const email = watch('email');

  const onSubmit = handleSubmit(async (data) => {
    setIsPending(true);

    await authClient.forgetPassword({
      email: data.email,
      redirectTo: '/reset-password',
    });

    setIsPending(false);
    setIsSuccess(true);
  });

  if (isSuccess && email) {
    return (
      <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2">
        <div className="relative hidden h-screen sm:block">
          <img src="/images/ship.svg" alt="App Info" className="h-full w-full object-cover object-left" />
        </div>
        <main className="flex h-screen w-full items-center justify-center px-8">
          <div className="flex w-full max-w-sm flex-col gap-4">
            <h2 className="text-2xl font-semibold">Reset link has been sent</h2>
            <p className="text-muted-foreground">
              A link to reset your password has just been sent to{' '}
              <span className="font-semibold text-foreground">{email}</span>. Please check your email inbox and follow the
              directions to reset your password.
            </p>
            <Button onClick={() => navigate({ to: '/sign-in' })}>Back to Sign In</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2">
      <div className="relative hidden h-screen sm:block">
        <img src="/images/ship.svg" alt="App Info" className="h-full w-full object-cover object-left" />
      </div>

      <main className="flex h-screen w-full items-center justify-center px-8">
        <div className="flex w-full max-w-md flex-col gap-6 text-lg">
          <h1 className="text-3xl font-bold">Forgot Password</h1>

          <p className="m-0 text-muted-foreground">
            Please enter your email and we&apos;ll send a link to reset your password.
          </p>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-2">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
