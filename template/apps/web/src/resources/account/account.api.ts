import { useMutation, useQuery } from '@tanstack/react-query';

import { apiService } from 'services';

import queryClient from 'query-client';

import { ApiError, User } from 'types';

export const useSignIn = <T>() =>
  useMutation<User, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/account/sign-in', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });

export const useSignOut = () =>
  useMutation<void, ApiError>({
    mutationFn: () => apiService.post('/account/sign-out'),
    onSuccess: () => {
      queryClient.setQueryData(['account'], null);
    },
  });

export const useSignUp = <T>() => {
  interface SignUpResponse {
    signupToken: string;
  }

  return useMutation<SignUpResponse, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/account/sign-up', data),
  });
};

export const useForgotPassword = <T>() =>
  useMutation<void, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/account/forgot-password', data),
  });

export const useResetPassword = <T>() =>
  useMutation<void, ApiError, T>({
    mutationFn: (data: T) => apiService.put('/account/reset-password', data),
  });

export const useResendEmail = <T>() =>
  useMutation<null, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/account/resend-email', data),
  });

export const useGet = (options = {}) =>
  useQuery<User>({
    queryKey: ['account'],
    queryFn: () => apiService.get('/account'),
    staleTime: 5 * 1000,
    ...options,
  });

export const useUpdate = <T>() =>
  useMutation<User, ApiError, T>({
    mutationFn: (data: T) => apiService.put('/account', data),
  });

export const useUploadAvatar = <T>() =>
  useMutation<User, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/account/avatar', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });

export const useRemoveAvatar = () =>
  useMutation<User, ApiError>({
    mutationFn: () => apiService.delete('/account/avatar'),
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });
