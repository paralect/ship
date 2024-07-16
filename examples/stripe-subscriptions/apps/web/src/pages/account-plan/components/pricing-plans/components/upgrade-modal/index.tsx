import React, { memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Modal, Space, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

import { subscriptionApi } from 'resources/subscription';

import * as routes from 'routes';

type Plan = {
  priceId: string;
  title: string;
};

type UpgradeModalPropTypes = {
  plan: Plan;
  onClose: () => void;
};

const UpgradeModal = ({ plan, onClose }: UpgradeModalPropTypes) => {
  const router = useRouter();
  const { data: invoicePreview, isFetching } = subscriptionApi.usePreviewUpgradeSubscription(plan.priceId);
  const { mutate: upgradeMutation, isPending } = subscriptionApi.useUpgradeSubscription();

  const isDowngrade = useMemo(
    () => plan.priceId === 'price_0' || (invoicePreview?.invoice?.total ?? 0) < 0,
    [plan.priceId, invoicePreview?.invoice?.total],
  );

  const text = useMemo(() => {
    if (isDowngrade) {
      return `Please confirm that you want to switch to ${plan.title}. The new plan will be applied immediately. We refund you the difference for the ${plan.title} to be used for your next payment.`;
    }

    return `Please confirm that you want to update to ${plan.title}. You will be upgraded immediately and charged the difference for the ${plan.title}.`;
  }, [plan.title, isDowngrade]);

  const onConfirm = () =>
    upgradeMutation(
      { priceId: plan.priceId },
      {
        onSuccess: () => router.push(`${routes.RoutePath.Home}?subscriptionPlan=${plan.priceId}`),
      },
    );

  const renderPrice = useCallback(() => {
    const { invoice } = invoicePreview ?? {};
    const totalAmount = Math.abs(invoice?.total ?? 0);
    const date = (invoice?.lines?.data[1]?.period.end ?? 0) * 1000;
    let secondRow = (
      <>
        <Text>Next payment</Text>
        <Text size="lg" w={600}>
          {dayjs(date).format('MMM DD, YYYY')}
        </Text>
      </>
    );

    if (isDowngrade) {
      const newSubscriptionPayment = invoice?.lines?.data[1]?.amount ?? 0;
      const balanceAfterNextPayment = newSubscriptionPayment - totalAmount;

      secondRow = (
        <>
          <Text>Total for the next payment</Text>
          <Text size="lg" w={600}>
            ${Math.max(balanceAfterNextPayment / 100, 0)}
          </Text>
        </>
      );
    }

    return (
      <>
        <Container mt={12}>
          <Text>{isDowngrade ? 'Refund' : 'Total Price'}</Text>
          <Text size="lg" w={600}>
            ${totalAmount / 100}
          </Text>
        </Container>
        {plan.priceId !== '0' && <Container>{secondRow}</Container>}
      </>
    );
  }, [invoicePreview, isDowngrade, plan.priceId]);

  return (
    <Modal
      opened
      centered
      title={
        <Title order={4}>
          You are about to {isDowngrade ? 'switch' : 'upgrade'} to {plan.title}
        </Title>
      }
      onClose={onClose}
    >
      <Space h={16} />
      <Text size="lg" c="dark.3">
        {text}
      </Text>

      {!isFetching && (
        <>
          {renderPrice()}
          <Space h={32} />
          <Container p={0} display="flex" style={{ gap: 16 }}>
            <Button disabled={isPending} variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={onConfirm}>
              Confirm
            </Button>
          </Container>
        </>
      )}
    </Modal>
  );
};

export default memo(UpgradeModal);
