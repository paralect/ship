import Head from 'next/head';
import Link from 'next/link';
import { useApiForm, useApiMutation } from 'hooks';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { LayoutType, Page, ScopeType } from 'components';

import { GoogleIcon } from 'public/icons';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import queryClient from 'query-client';
import config from 'config';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const SignIn = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useApiForm(apiClient.account.signIn);

  // API error fields set via setError
  const apiErrors = errors as typeof errors & {
    credentials?: { message?: string };
    emailVerificationTokenExpired?: { message?: string };
  };

  const { mutate: signIn, isPending: isSignInPending } = useApiMutation(apiClient.account.signIn, {
    onSuccess: (data) => {
      queryClient.setQueryData([apiClient.account.get.path], data);
    },
  });
  const { mutate: resendEmail, isPending: isResendEmailPending } = useApiMutation(apiClient.account.resendEmail);

  const onSubmit = handleSubmit((data) =>
    signIn(data, {
      onError: (e) => handleApiError(e, setError),
    }),
  );

  const onResendEmail = () => {
    if (isResendEmailPending) return;

    resendEmail(
      { email: watch('email') },
      {
        onError: (e) => handleApiError(e, setError),
        onSuccess: () => {
          toast.success('Verification email sent', {
            description: 'Please check your email to verify your account.',
          });
        },
      },
    );
  };

  return (
    <Page scope={ScopeType.PUBLIC} layout={LayoutType.UNAUTHORIZED}>
      <Head>
        <title>Sign in</title>
      </Head>

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

              {apiErrors.credentials && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiErrors.credentials.message}</AlertDescription>
                </Alert>
              )}

              {apiErrors.emailVerificationTokenExpired && (
                <Alert variant="default" className="border-yellow-500 bg-yellow-50 text-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="flex flex-col gap-1">
                      <span>Please verify your email to sign in.</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={onResendEmail} className="text-sm underline hover:no-underline">
                          Resend verification email
                        </button>
                        {isResendEmailPending && <Loader2 className="h-3 w-3 animate-spin" />}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
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
          <Button variant="outline" asChild>
            <a href={`${config.API_URL}/account/sign-in/google`} className="flex items-center gap-2">
              <GoogleIcon className="size-5 shrink-0" />
              Continue with Google
            </a>
          </Button>

          <div className="flex items-center justify-center gap-3">
            <span>Don&apos;t have an account?</span>
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SignIn;
