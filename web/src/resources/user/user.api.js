import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/users/current');

  return useQuery(['currentUser'], getCurrent);
}

export function useUpdateCurrent() {
  const updateCurrent = (data) => apiService.post('/users/current', data);

  return useMutation(updateCurrent);
}

export function useUploadProfilePhoto() {
  const uploadProfilePhoto = (data) => apiService.post('/users/upload-photo', data);

  return useMutation(uploadProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useRemoveProfilePhoto() {
  const removeProfilePhoto = () => apiService.delete('/users/remove-photo');

  return useMutation(removeProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export const useList = (params) => {
  const list = () => apiService.get('/users', params);

  return useQuery(['users', params], list);
};
