import { useMutation } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

export function useSignIn() {
  const signIn = (data) => apiService.post('/account/sign-in', data);

  return useMutation(signIn, {
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

export function useSignUp() {
  const signUp = (data) => apiService.post('/account/sign-up', data);

  return useMutation(signUp);
}

export function useForgotPassword() {
  const forgotPassword = (data) => apiService.post('/account/forgot-password', data);

  return useMutation(forgotPassword);
}

export function useResetPassword() {
  const resetPassword = (data) => apiService.put('/account/reset-password', data);

  return useMutation(resetPassword);
}

export function useResendEmail() {
  const resendEmail = (data) => apiService.post('/account/resend-email', data);

  return useMutation(resendEmail);
}
