import { useQuery } from 'react-query';
import queryClient from 'query-client';

import { apiService } from 'services';
import { handleError } from 'utils';

import { StripePageDirections } from './payment.types';
import type {
  CustomerPaymentInformation,
  PaymentHistoryItem,
  StripePagination,
} from './payment.types';

export function useGetPaymentInformation() {
  const getPaymentInformation = () => apiService.get('/payments/payment-information');

  return useQuery<CustomerPaymentInformation>(['paymentInformation'], getPaymentInformation);
}

export function useGetPaymentHistory(params: StripePagination) {
  const cursorIds: Record<string, any> | undefined = queryClient.getQueryData('paymentHistoryCursorId');

  const getPaymentHistory = () => apiService.get(
    'payments/get-history',
    {
      ...params,
      cursorId: params.direction === StripePageDirections.FORWARD
        ? cursorIds?.lastItemId
        : cursorIds?.firstItemId,
    },
  );

  type PaymentHistory = {
    data: PaymentHistoryItem[],
    count: number,
    totalPages: number,

    hasMore: boolean,
    firstItemId: string | null,
    lastItemId: string | null,
  };

  return useQuery<PaymentHistory>(['paymentHistory', params], getPaymentHistory, {
    onSuccess: (results: PaymentHistory) => {
      queryClient.setQueryData('paymentHistoryCursorId', {
        firstItemId: results.firstItemId,
        lastItemId: results.lastItemId,
      });
    },
  });
}

export function useSetupPaymentIntent() {
  const setupPaymentIntent = () => apiService.post('payments/create-setup-intent');

  return useQuery(['paymentIntent'], setupPaymentIntent, {
    onError: handleError,
  });
}
