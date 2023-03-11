import { FC, useState } from 'react';
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
import { paymentApi } from 'resources/payment';

import PaymentHistory from '../payment-history';

import { useStyles } from './styles';

const CurrentPlan: FC = () => {
  const { classes, cx } = useStyles();

  const { data: subscriptionDetails } = subscriptionApi.useGetDetails();
  const { data: paymentInformation } = paymentApi.useGetPaymentInformation();

  const [isPaymentCardModalOpened, setIsPaymentCardModalOpened] = useState(false);

  return (
    <>
      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1', margin: 0 }} px={0}>
          <Text size="lg" weight={600}>Current plan</Text>
          <Title order={1}>{subscriptionDetails?.product?.name || 'Basic'}</Title>
        </Container>
        {subscriptionDetails && (
          <Container sx={{ flex: '2 1' }} px={0}>
            <Text size="lg" weight={600}>Next payment</Text>
            <Title sx={{ display: 'inline' }} order={1}>
              $
              {(subscriptionDetails?.pendingInvoice?.amountDue || 0) / 100}
            </Title>
            <Text color="grey" sx={{ marginLeft: '8px' }} component="span">
              on
              {' '}
              {dayjs((subscriptionDetails?.currentPeriodEndDate || 0) * 1000).format('MMM DD, YYYY')}
            </Text>
          </Container>
        )}
      </Group>

      {paymentInformation?.card && (
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
            <Container
              sx={{ padding: 0 }}
              className={cx({ [classes.hidden]: !isPaymentCardModalOpened })}
            >
              <PaymentCard
                onCancel={() => setIsPaymentCardModalOpened(false)}
              />
            </Container>

            <Button
              variant="outline"
              sx={(theme) => ({
                display: isPaymentCardModalOpened ? 'none' : 'block',
                maxWidth: '250px',
                color: theme.colors.blue[6],
                borderColor: theme.colors.blue[6],
              })}
              onClick={() => setIsPaymentCardModalOpened(!isPaymentCardModalOpened)}
            >
              Change payment method
            </Button>
          </Container>
        </Group>
      )}

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
