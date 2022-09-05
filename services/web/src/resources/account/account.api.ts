import { useMutation } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';
import { UserDto } from 'types';
import { ForgotPasswordVariables, ResendEmailVariables, ResetPasswordVariables, SignInVariables, SignUpResponse, SignUpVariables } from './account.types';

export function useSignIn() {
  const signIn = (data: SignInVariables) => apiService.post('/account/sign-in', data);

  return useMutation<UserDto, unknown, SignInVariables>(signIn, {
    onSuccess: (data: UserDto) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useSignOut() {
  const signOut = () => apiService.post('/account/sign-out');

  return useMutation<{}>(signOut, {
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
    },
  });
}

export function useSignUp() {
  const signUp = (data: SignUpVariables) => apiService.post('/account/sign-up', data);

  return useMutation<SignUpResponse, unknown, SignUpVariables>(signUp);
}

export function useForgotPassword() {
  const forgotPassword = (data: ForgotPasswordVariables) => apiService.post('/account/forgot-password', data);

  return useMutation<{}, unknown, ForgotPasswordVariables>(forgotPassword);
}

export function useResetPassword() {
  const resetPassword = (data: ResetPasswordVariables) => apiService.put('/account/reset-password', data);

  return useMutation<{}, unknown, ResetPasswordVariables>(resetPassword);
}

export function useResendEmail() {
  const resendEmail = (data: ResendEmailVariables) => apiService.post('/account/resend-email', data);

  return useMutation<{}, unknown, ResendEmailVariables>(resendEmail);
}
