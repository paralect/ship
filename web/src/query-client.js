import { QueryClient } from 'react-query';

import { handleError } from 'helpers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      keepPreviousData: true,
      onError: (err) => handleError(err),
    },
  },
});

export default queryClient;
