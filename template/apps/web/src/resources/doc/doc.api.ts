import { useQuery } from 'react-query';

import { apiService } from 'services';

export function useGetDocsJson() {
  const getDocsJson = () => apiService.get('/docs/json');

  return useQuery(['docs'], getDocsJson);
}
