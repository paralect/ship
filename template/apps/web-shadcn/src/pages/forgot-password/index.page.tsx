import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { handleApiError } from 'utils';

import { RoutePath } from 'routes';

import { forgotPasswordSchema } from 'schemas';
import { ForgotPasswordParams } from 'types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
    isSuccess: isForgotPasswordSuccess,
  } = accountApi.useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordParams>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = (data: ForgotPasswordParams) =>
    forgotPassword(data, {
      onError: (e) => handleApiError(e, setError),
    });

  if (isForgotPasswordSuccess && email) {
    return (
      <>
        <Head>
          <title>Forgot password</title>
        </Head>

        <div className="flex w-[328px] flex-col gap-4">
          <h2 className="text-2xl font-semibold">Reset link has been sent</h2>

          <p className="text-muted-foreground">
            A link to reset your password has just been sent to{' '}
            <span className="font-semibold text-foreground">{email}</span>. Please check your email inbox and follow the
            directions to reset your password.
          </p>

          <Button onClick={() => router.push(RoutePath.SignIn)}>Back to Sign In</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forgot password</title>
      </Head>

      <div className="flex w-[400px] flex-col gap-6 text-lg">
        <h1 className="text-3xl font-bold">Forgot Password</h1>

        <p className="m-0 text-muted-foreground">
          Please enter your email and we&apos;ll send a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
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

            <Button type="submit" disabled={isForgotPasswordPending}>
              {isForgotPasswordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset link
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2">
          <span>Have an account?</span>
          <Link href={RoutePath.SignIn} className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
