import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';
import { UserDto } from 'types';
import { UpdateCurrentVariables, UserListResponse, UsersListParams } from './user.types';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/users/current');

  return useQuery(['currentUser'], getCurrent);
}

export function useUpdateCurrent() {
  const updateCurrent = (data: UpdateCurrentVariables) => apiService.post('/users/current', data);

  return useMutation<UserDto, unknown, UpdateCurrentVariables>(updateCurrent);
}

export function useUploadProfilePhoto() {
  const uploadProfilePhoto = (data: FormData) => apiService.post('/users/upload-photo', data);

  return useMutation<UserDto, unknown, FormData>(uploadProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useRemoveProfilePhoto() {
  const removeProfilePhoto = () => apiService.delete('/users/remove-photo');

  return useMutation<UserDto>(removeProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export const useList = (params: UsersListParams) => {
  const list = () => apiService.get('/users', params);

  return useQuery<unknown, unknown, UserListResponse>(['users', params], list);
};
