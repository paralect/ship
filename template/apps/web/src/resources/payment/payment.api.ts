import { useQuery } from 'react-query';

import { apiService } from 'services';
import { handleError } from 'utils';

import type { CustomerPaymentInformation, PaymentHistoryItem } from './payment.types';

export function useGetPaymentInformation() {
  const getPaymentInformation = () => apiService.get('/payments/payment-information');

  return useQuery<CustomerPaymentInformation>(['paymentInformation'], getPaymentInformation);
}

export function useGetPaymentHistory<T>(params: T) {
  const getPaymentHistory = () => apiService.get('payments/get-history', { ...params });

  interface PaymentHistory {
    data: PaymentHistoryItem[],
    count: number,
    totalPages: number,
  }

  return useQuery<PaymentHistory>(['paymentHistory', params], getPaymentHistory);
}

export function useSetupPaymentIntent() {
  const setupPaymentIntent = () => apiService.post('payments/create-setup-intent');

  return useQuery(['paymentIntent'], setupPaymentIntent, {
    onError: handleError,
  });
}
