import { FC, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import {
  Button,
  Container,
  Modal,
  Space,
  Title,
  Text,
} from '@mantine/core';

import * as routes from 'routes';
import { subscriptionApi } from 'resources/subscription';

import { useStyles } from './styles';

type Plan = {
  priceId: string,
  title: string,
};

type UpgradeModalPropTypes = {
  plan: Plan,
  onClose: () => void,
};

const UpgradeModal: FC<UpgradeModalPropTypes> = (props) => {
  const { plan, onClose } = props;
  const { classes } = useStyles();
  const router = useRouter();

  const {
    data: invoicePreview,
    isFetching,
    remove,
  } = subscriptionApi.usePreviewUpgradeSubscription(plan.priceId);
  const upgradeMutation = subscriptionApi.useUpgradeSubscription();

  useEffect(() => remove, [remove]);

  const isDowngrade = useMemo(
    () => plan.priceId === 'price_0' || invoicePreview?.invoice?.total < 0,
    [
      plan.priceId,
      invoicePreview?.invoice?.total,
    ],
  );

  const text = useMemo(() => {
    if (isDowngrade) {
      return `Please, confirm that you want to switch to ${plan.title}. The new plan will be applied immediately. We refund you the difference for the ${plan.title} to be used for your next payment.`;
    }

    return `Please, confirm that you want to update to ${plan.title}. You will be upgraded immediately and charged the difference for the ${plan.title}.`;
  }, [
    plan.title,
    isDowngrade,
  ]);

  const onConfirm = useCallback(() => {
    upgradeMutation.mutate({
      priceId: plan.priceId,
    }, {
      onSuccess: () => {
        router.push(`${routes.RoutePath.Home}?subscriptionPlan=${plan.priceId}`);
      },
    });
  }, [upgradeMutation, plan.priceId, router]);

  const renderPrice = useCallback(() => {
    const { invoice } = invoicePreview;
    const totalAmount = Math.abs(invoice.total);
    const date = (invoice.lines?.data[1]?.period.end || 0) * 1000;

    let secondRow = (
      <>
        <Text>Next payment</Text>
        <Text size="lg" weight={600}>
          {dayjs(date).format('MMM DD, YYYY')}
        </Text>
      </>
    );

    if (isDowngrade) {
      const newSubscriptionPayment = invoice.lines?.data[1]?.amount || 0;
      const balanceAfterNextPayment = newSubscriptionPayment - totalAmount;

      secondRow = (
        <>
          <Text>Total for the next payment</Text>
          <Text size="lg" weight={600}>
            $
            {Math.max(balanceAfterNextPayment / 100, 0)}
          </Text>
        </>
      );
    }

    return (
      <>
        <Container className={classes.row} sx={{ marginTop: '12px' }}>
          <Text>{isDowngrade ? 'Refund' : 'Total Price'}</Text>
          <Text size="lg" weight={600}>
            $
            {totalAmount / 100}
          </Text>
        </Container>
        {plan.priceId !== '0' && (
          <Container className={classes.row}>
            {secondRow}
          </Container>
        )}
      </>
    );
  }, [invoicePreview, isDowngrade, classes.row, plan.priceId]);

  return (
    <Modal
      opened
      centered
      title={(
        <Title order={4}>
          You are about to
          {' '}
          {isDowngrade ? 'switch' : 'upgrade'}
          {' '}
          to
          {' '}
          {plan.title}
        </Title>
      )}
      onClose={onClose}
    >
      <Space h={16} />
      <Text
        sx={(theme) => ({
          color: theme.colors.dark[3],
          fontSize: '14px',
        })}
      >
        {text}
      </Text>

      {!isFetching && (
        <>
          {renderPrice()}
          <Space h={32} />
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 0,
              gap: '16px',
            }}
          >
            <Button disabled={upgradeMutation.isLoading} variant="subtle" onClick={onClose}>Cancel</Button>
            <Button disabled={upgradeMutation.isLoading} onClick={onConfirm}>Confirm</Button>
          </Container>
        </>
      )}
    </Modal>
  );
};

export default memo(UpgradeModal);
