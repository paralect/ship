import { useQuery, useMutation } from 'react-query';

import { apiService } from 'services';

import type { Subscription } from './subscription.types';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('subscriptions/current');

  return useQuery<Subscription>(['currentSubscription'], getCurrent);
}

export function useSubscribe<T>() {
  const subscribe = (data: T) => apiService.post('subscriptions/subscribe', data);

  return useMutation(subscribe, {
    onSuccess: (data) => {
      window.location.href = data.checkoutLink;
    },
  });
}

export function useCancelSubscription() {
  const cancel = (subscriptionId: string) => apiService.post('subscriptions/cancel', { subscriptionId });

  return useMutation(cancel);
}

export function usePreviewUpgradeSubscription(priceId: string) {
  const preview = () => apiService.get('subscriptions/preview-upgrade', { priceId });

  return useQuery(['previewUpgrade'], preview);
}

export function useUpgradeSubscription<T>() {
  const upgrade = (data: T) => apiService.post('subscriptions/upgrade', data);

  return useMutation(upgrade);
}
