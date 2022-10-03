import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import { User } from './user.types';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/users/current');

  return useQuery<User>(['currentUser'], getCurrent);
}

export function useUpdateCurrent<T>() {
  const updateCurrent = (data: T) => apiService.post('/users/current', data);

  return useMutation<User, unknown, T>(updateCurrent);
}

export function useUploadProfilePhoto<T>() {
  const uploadProfilePhoto = (data: T) => apiService.post('/users/upload-photo', data);

  return useMutation<User, unknown, T>(uploadProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useRemoveProfilePhoto() {
  const removeProfilePhoto = () => apiService.delete('/users/remove-photo');

  return useMutation<User>(removeProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/users', params);

  interface UserListResponse {
    count: number;
    items: User[];
    totalPages: number;
  }

  return useQuery<UserListResponse>(['users', params], list);
}
