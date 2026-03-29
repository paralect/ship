import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useApiForm } from 'hooks';
import { FormProvider } from 'react-hook-form';

import { LayoutType, Page, ScopeType } from 'components';

import { GoogleIcon } from 'public/icons';

import { apiClient } from 'services/api-client.service';
import { authClient } from 'services/auth-client.service';

import { signUpSchema } from 'schemas';

import PasswordRules from './components/PasswordRules';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const SignUp = () => {
  const methods = useApiForm(signUpSchema);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const [isSignUpPending, setIsSignUpPending] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const emailValue = watch('email');

  const onSubmit = handleSubmit(async (data) => {
    setIsSignUpPending(true);
    setApiError(null);

    const { error } = await authClient.signUp.email({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });

    setIsSignUpPending(false);

    if (error) {
      setApiError(error.message || 'Sign up failed');
      return;
    }

    setIsSignUpSuccess(true);
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/app',
    });
  };

  if (isSignUpSuccess) {
    return (
      <Page scope={ScopeType.PUBLIC} layout={LayoutType.UNAUTHORIZED}>
        <Head>
          <title>Sign up</title>
        </Head>

        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Thanks!</h2>

          <p className="text-muted-foreground">
            Please follow the instructions from the email to complete a sign up process. We sent an email with a
            confirmation link to <span className="font-semibold text-foreground">{emailValue}</span>
          </p>

          {process.env.NODE_ENV === 'development' && !isVerified && (
            <div className="space-y-1">
              <p>You look like a cool developer</p>

              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={async () => {
                  await apiClient.users.devVerifyEmail({ email: emailValue });
                  setIsVerified(true);
                }}
              >
                Verify email
              </Button>
            </div>
          )}

          {isVerified && (
            <div className="space-y-1">
              <p className="text-sm text-green-600">Email verified!</p>
              <Link href="/sign-in" className="text-sm text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </Page>
    );
  }

  return (
    <Page scope={ScopeType.PUBLIC} layout={LayoutType.UNAUTHORIZED}>
      <Head>
        <title>Sign up</title>
      </Head>

      <FormProvider {...methods}>
        <div className="w-full max-w-md space-y-5">
          <form onSubmit={onSubmit} className="space-y-8">
            <h1 className="text-3xl font-bold">Sign Up</h1>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  maxLength={128}
                  placeholder="Enter full name"
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Enter email address"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <PasswordRules
                render={({ onFocus, onBlur }) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      {...register('password')}
                      placeholder="Enter password"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      aria-invalid={!!errors.password}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                )}
              />

              {apiError && <p className="text-sm text-destructive">{apiError}</p>}
            </div>

            <Button type="submit" disabled={isSignUpPending} className="mt-8 w-full">
              {isSignUpPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="space-y-8">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 size-5 shrink-0" />
              Continue with Google
            </Button>

            <div className="flex items-center justify-center gap-3">
              <span>Have an account?</span>
              <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </FormProvider>
    </Page>
  );
};

export default SignUp;
