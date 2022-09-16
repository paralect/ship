import { useMutation } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';
import { User } from 'resources/user';

export function useSignIn<T>() {
  const signIn = (data: T) => apiService.post('/account/sign-in', data);

  return useMutation<User, unknown, T>(signIn, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useSignOut() {
  const signOut = () => apiService.post('/account/sign-out');

  return useMutation(signOut, {
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
    },
  });
}

export function useSignUp<T>() {
  const signUp = (data: T) => apiService.post('/account/sign-up', data);

  interface SignUpResponse {
    signupToken: string;
  }

  return useMutation<SignUpResponse, unknown, T>(signUp);
}

export function useForgotPassword<T>() {
  const forgotPassword = (data: T) => apiService.post('/account/forgot-password', data);

  return useMutation<{}, unknown, T>(forgotPassword);
}

export function useResetPassword<T>() {
  const resetPassword = (data: T) => apiService.put('/account/reset-password', data);

  return useMutation<{}, unknown, T>(resetPassword);
}

export function useResendEmail<T>() {
  const resendEmail = (data: T) => apiService.post('/account/resend-email', data);

  return useMutation<{}, unknown, T>(resendEmail);
}
