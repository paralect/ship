import { useQuery } from 'react-query';

import { apiService } from 'services';

export function useSetupPaymentIntent() {
  const setupPaymentIntent = () => apiService.post('payments/create-setup-intent');

  return useQuery(['paymentIntent'], setupPaymentIntent);
}
