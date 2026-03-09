import Head from 'next/head';
import Link from 'next/link';
import { useApiForm, useApiMutation } from 'hooks';
import { FormProvider } from 'react-hook-form';

import { LayoutType, Page, ScopeType } from 'components';

import { GoogleIcon } from 'public/icons';

import { apiClient } from 'services/api-client.service';
import { handleApiError } from 'utils';

import config from 'config';

import PasswordRules from './components/PasswordRules';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

const SignUp = () => {
  const methods = useApiForm(apiClient.account.signUp);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const emailValue = watch('email');

  const {
    mutate: signUp,
    isPending: isSignUpPending,
    isSuccess: isSignUpSuccess,
    data: signUpData,
  } = useApiMutation(apiClient.account.signUp);

  const onSubmit = handleSubmit((data) =>
    signUp(data, {
      onError: (e) => handleApiError(e, setError),
    }),
  );

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

          {signUpData?.emailVerificationToken && (
            <div className="space-y-1">
              <p>You look like a cool developer 🧑‍💻</p>

              <a
                className="text-sm text-primary underline-offset-4 hover:underline"
                href={`${config.API_URL}/account/verify-email?token=${signUpData.emailVerificationToken}`}
                target="_blank"
                rel="noreferrer"
              >
                Verify email
              </a>
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  maxLength={100}
                  placeholder="Enter first Name"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  maxLength={100}
                  placeholder="Enter last Name"
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Enter email Address"
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
            </div>

            <Button type="submit" disabled={isSignUpPending} className="mt-8 w-full">
              {isSignUpPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="space-y-8">
            <Button variant="outline" className="w-full" asChild>
              <a href={`${config.API_URL}/account/sign-in/google`}>
                <GoogleIcon className="mr-2 size-5 shrink-0" />
                Continue with Google
              </a>
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
