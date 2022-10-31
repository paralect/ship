import { FC, useState, useMemo } from 'react';
import dayjs from 'dayjs';

import {
  Button,
  Container,
  Group,
  Text,
  Title,
} from '@mantine/core';
import { PaymentCard } from 'components';

import { subscriptionApi } from 'resources/subscription';
import { accountApi } from 'resources/account';

import PaymentHistory from '../payment-history';

import { useStyles } from './styles';

const CurrentPlan: FC = () => {
  const { classes } = useStyles();

  const { data: currentSubscription } = subscriptionApi.useGetCurrent();
  const { data: paymentInformation } = accountApi.useGetPaymentInformation();

  const [isPaymentCardModalOpened, setIsPaymentCardModalOpened] = useState(false);

  const paymentMethodForm = useMemo(() => {
    if (isPaymentCardModalOpened) {
      return (
        <PaymentCard
          onCancel={() => setIsPaymentCardModalOpened(false)}
        />
      );
    }

    return (
      <Button
        variant="outline"
        sx={(theme) => ({
          maxWidth: '250px',
          color: theme.colors.blue[6],
          borderColor: theme.colors.blue[6],
        })}
        onClick={() => setIsPaymentCardModalOpened(!isPaymentCardModalOpened)}
      >
        Change payment method
      </Button>
    );
  }, [setIsPaymentCardModalOpened, isPaymentCardModalOpened]);

  return (
    <>
      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="lg" weight={600}>Current plan</Text>
          <Title order={1}>{currentSubscription?.product?.name}</Title>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          <Text size="lg" weight={600}>Next payment</Text>
          <Title sx={{ display: 'inline' }} order={1}>
            $
            {(currentSubscription?.pendingInvoice?.amountDue || 0) / 100}
          </Title>
          <Text color="grey" sx={{ marginLeft: '8px' }} component="span">
            on
            {' '}
            {dayjs((currentSubscription?.currentPeriodEndDate || 0) * 1000).format('MMM DD, YYYY')}
          </Text>
        </Container>
      </Group>

      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="md" weight={600}>Payment method</Text>
          <Text color="grey">
            {paymentInformation?.card.brand}
            {' '}
            ****
            {paymentInformation?.card.last4}
          </Text>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          {paymentMethodForm}
        </Container>
      </Group>

      <Group
        grow
        className={classes.section}
      >
        <PaymentHistory />
      </Group>
    </>
  );
};

export default CurrentPlan;
