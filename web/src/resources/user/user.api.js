import { useMutation, useQuery } from 'react-query';

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

  return useMutation(uploadProfilePhoto);
}

export function useRemoveProfilePhoto() {
  const removeProfilePhoto = () => apiService.delete('/users/remove-photo');

  return useMutation(removeProfilePhoto);
}

export const useList = (params) => {
  const list = () => apiService.get('/users', params);

  return useQuery(['users', params], list);
};
