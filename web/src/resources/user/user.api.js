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

export const useList = (params) => {
  const list = () => apiService.get('/users', params);

  return useQuery(['users', params], list);
};
