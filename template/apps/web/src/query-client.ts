import { QueryClient, keepPreviousData } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      placeholderData: keepPreviousData,
    },
  },
});

export default queryClient;
