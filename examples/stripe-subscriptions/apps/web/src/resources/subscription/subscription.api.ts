import { useMutation, useQuery } from '@tanstack/react-query';
import { Subscription } from 'app-types';

import { apiService } from 'services';

export const useGetDetails = () =>
  useQuery<Subscription>({
    queryKey: ['subscriptionDetails'],
    queryFn: () => apiService.get('subscriptions/current'),
  });

export const useSubscribe = <T>() =>
  useMutation<Subscription & { checkoutLink: string }, unknown, T>({
    mutationFn: (data: T) => apiService.post('subscriptions/subscribe', data),
    onSuccess: (data) => {
      window.location.href = data.checkoutLink;
    },
  });

export const useCancelSubscription = <T>() =>
  useMutation({
    mutationFn: (data: T) => apiService.post('subscriptions/cancel', data),
  });

export const usePreviewUpgradeSubscription = (priceId: string) =>
  useQuery({
    queryKey: ['previewUpgrade', priceId],
    queryFn: () => apiService.get('subscriptions/preview-upgrade', { priceId }),
  });

export const useUpgradeSubscription = <T>() =>
  useMutation<Subscription, unknown, T>({
    mutationFn: (data: T) => apiService.post('subscriptions/upgrade', data),
  });
