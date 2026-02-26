'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApiMutation, useApiQuery } from 'hooks';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';

import { plans } from './constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Pricing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const portal = searchParams.get('portal');

  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription,
  } = useApiQuery(apiClient.subscriptions.getCurrent);

  const { mutate: subscribe, isPending: isSubscribePending } = useApiMutation(apiClient.subscriptions.subscribe, {
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: () => {
      toast.error('Failed to start checkout');
    },
  });

  const { mutate: upgrade, isPending: isUpgradePending } = useApiMutation(apiClient.subscriptions.upgrade, {
    onSuccess: () => {
      toast.success('Plan changed successfully!');
      refetchSubscription();
    },
    onError: () => {
      toast.error('Failed to change plan');
    },
  });

  const { mutate: createPortalSession, isPending: isPortalPending } = useApiMutation(
    apiClient.subscriptions.createPortalSession,
    {
      onSuccess: (data) => {
        window.location.href = data.portalUrl;
      },
      onError: () => {
        toast.error('Failed to open billing portal');
      },
    },
  );

  useEffect(() => {
    if (success) {
      toast.success('Subscription successful! Welcome aboard.');
      refetchSubscription();
      router.replace(RoutePath.Pricing);
    }
    if (canceled) {
      toast.info('Checkout was canceled.');
      router.replace(RoutePath.Pricing);
    }
    if (portal) {
      refetchSubscription();
      router.replace(RoutePath.Pricing);
    }
  }, [success, canceled, portal, router, refetchSubscription]);

  const currentPriceId = subscription?.priceId;
  const hasSubscription = !!subscription;
  const isCanceled = subscription?.cancelAtPeriodEnd;
  const periodEndDate = subscription?.currentPeriodEndDate
    ? new Date(subscription.currentPeriodEndDate * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  const handlePlanAction = (priceId: string | null) => {
    if (!priceId) return;

    if (hasSubscription) {
      upgrade({ priceId });
    } else {
      subscribe({ priceId });
    }
  };

  const getPlanButton = (plan: (typeof plans)[0]) => {
    const currentPlanIndex = plans.findIndex((p) => p.priceId === currentPriceId);
    const targetPlanIndex = plans.findIndex((p) => p.priceId === plan.priceId);

    const isCurrentPlan = plan.priceId === currentPriceId;
    const isFreeAndNoSubscription = !plan.priceId && !hasSubscription;
    const isDowngrade = hasSubscription && targetPlanIndex < currentPlanIndex;
    const isPending = isSubscribePending || isUpgradePending;

    if (!plan.priceId && isCanceled) {
      return (
        <Button variant="outline" disabled className="w-full">
          Starting {periodEndDate}
        </Button>
      );
    }

    if (isFreeAndNoSubscription) {
      return (
        <Button variant="outline" disabled className="w-full">
          Current Plan
        </Button>
      );
    }

    if (isCurrentPlan && isCanceled) {
      return (
        <Button variant="outline" disabled className="w-full">
          Until {periodEndDate}
        </Button>
      );
    }

    if (isCurrentPlan) {
      return (
        <Button variant="outline" disabled className="w-full">
          Current Plan
        </Button>
      );
    }

    if (isCanceled && plan.priceId) {
      return (
        <Button
          onClick={() => createPortalSession({})}
          disabled={isPortalPending}
          variant={plan.popular ? 'default' : 'outline'}
          className="w-full"
        >
          {isPortalPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Resubscribe
        </Button>
      );
    }

    if (isDowngrade && !plan.priceId) {
      return (
        <Button variant="outline" onClick={() => createPortalSession({})} disabled={isPortalPending} className="w-full">
          {isPortalPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Downgrade
        </Button>
      );
    }

    if (isDowngrade && plan.priceId) {
      return (
        <Button
          variant="outline"
          onClick={() => handlePlanAction(plan.priceId)}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Downgrade
        </Button>
      );
    }

    return (
      <Button
        onClick={() => handlePlanAction(plan.priceId)}
        disabled={isPending}
        variant={plan.popular ? 'default' : 'outline'}
        className="w-full"
      >
        {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        {hasSubscription ? 'Upgrade' : 'Subscribe'}
      </Button>
    );
  };

  if (isSubscriptionLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pricing</title>
      </Head>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Choose Your Plan</h1>
          <p className="mt-4 text-muted-foreground">
            Select the plan that best fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceId && <span className="text-muted-foreground">/month</span>}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>{getPlanButton(plan)}</CardFooter>
            </Card>
          ))}
        </div>

        {hasSubscription && (
          <div className="mt-8 text-center">
            <Button variant="link" onClick={() => createPortalSession({})} disabled={isPortalPending}>
              {isPortalPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Manage Subscription
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Pricing;
