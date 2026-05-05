import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { queryKey, useApiForm } from '@/hooks';
import { AlertCircle, Loader2 } from 'lucide-react';

import { authClient } from '@/services/auth-client.service';
import queryClient from '@/query-client';
import { apiClient } from '@/services/api-client.service';
import { signInSchema } from '@/schemas';

import { GoogleIcon } from '@/assets/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [isSignInPending, setIsSignInPending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useApiForm(signInSchema);

  const onSubmit = handleSubmit(async (data) => {
    setIsSignInPending(true);
    setApiError(null);

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    setIsSignInPending(false);

    if (error) {
      setApiError(error.message || 'The email or password you have entered is invalid');
      return;
    }

    await navigate({ to: '/app' });
    queryClient.invalidateQueries({ queryKey: queryKey(apiClient.users.getCurrent) });
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/app',
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2">
      <div className="relative hidden h-screen sm:block">
        <img src="/images/ship.svg" alt="App Info" className="h-full w-full object-cover object-left" />
      </div>

      <main className="flex h-screen w-full items-center justify-center px-8">
        <div className="flex w-full max-w-md flex-col gap-5">
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Sign In</h1>

            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
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

                {apiError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{apiError}</AlertDescription>
                  </Alert>
                )}

                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isSignInPending} className="mt-8 w-full">
                {isSignInPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 size-5 shrink-0" />
              Continue with Google
            </Button>

            <div className="flex items-center justify-center gap-3">
              <span>Don&apos;t have an account?</span>
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
