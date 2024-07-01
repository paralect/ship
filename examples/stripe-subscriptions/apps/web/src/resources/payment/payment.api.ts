import { useQuery } from '@tanstack/react-query';
import { CustomerPaymentInformation, HistoryItem, StripePageDirections, StripePagination } from 'app-types';

import { apiService } from 'services';

import queryClient from 'query-client';

export const useGetPaymentInformation = () =>
  useQuery<CustomerPaymentInformation>({
    queryKey: ['paymentInformation'],
    queryFn: () => apiService.get('/payments/payment-information'),
  });

export const useGetPaymentHistory = (params: StripePagination) => {
  const { data: cursorIds } = useQuery<Record<string, string> | undefined>({
    queryKey: ['paymentHistoryCursorId'],
    queryFn: () => queryClient.getQueryData(['paymentHistoryCursorId']) ?? {},
  });

  const getPaymentHistory = () =>
    apiService.get('payments/get-history', {
      ...params,
      cursorId: params.direction === StripePageDirections.FORWARD ? cursorIds?.lastItemId : cursorIds?.firstItemId,
    });

  const { data, isFetching } = useQuery<{
    data: HistoryItem[];
    count: number;
    totalPages: number;
    hasMore: boolean;
    firstItemId: string | null;
    lastItemId: string | null;
  }>({
    queryKey: ['paymentHistory', params],
    queryFn: getPaymentHistory,
  });

  return { data, isFetching };
};

export const useSetupPaymentIntent = () =>
  useQuery<{ clientSecret: string }>({
    queryKey: ['paymentIntent'],
    queryFn: () => apiService.post('payments/create-setup-intent'),
  });
