import React, { FC, useState } from 'react';
import { Button, Container, Group, Text, Title } from '@mantine/core';
import cx from 'clsx';
import dayjs from 'dayjs';

import { paymentApi } from 'resources/payment';
import { subscriptionApi } from 'resources/subscription';

import { PaymentCard } from 'components';

import PaymentHistory from '../payment-history';

import classes from './index.module.css';

const CurrentPlan: FC = () => {
  const { data: subscriptionDetails } = subscriptionApi.useGetDetails();

  const { data: paymentInformation } = paymentApi.useGetPaymentInformation();

  const [isPaymentCardModalOpened, setIsPaymentCardModalOpened] = useState(false);

  return (
    <>
      <Group className={classes.root}>
        <Container px={0} m={0} flex="1 1">
          <Text size="lg" w={600}>
            Current plan
          </Text>
          <Title order={1}>{subscriptionDetails?.product?.name || 'Basic'}</Title>
        </Container>
        {subscriptionDetails && (
          <Container px={0} flex="2 1">
            <Text size="lg" w={600}>
              Next payment
            </Text>
            <Title display="inline" order={1}>
              ${(subscriptionDetails?.pendingInvoice?.amountDue || 0) / 100}
            </Title>
            <Text c="grey" ml={8} component="span">
              on {dayjs((subscriptionDetails?.currentPeriodEndDate || 0) * 1000).format('MMM DD, YYYY')}
            </Text>
          </Container>
        )}
      </Group>

      {paymentInformation?.card && (
        <Group className={classes.root}>
          <Container flex="1 1" px={0}>
            <Text size="md" w={600}>
              Payment method
            </Text>
            <Text c="grey">
              {paymentInformation?.card.brand} ****
              {paymentInformation?.card.last4}
            </Text>
          </Container>
          <Container flex="2 1" px={0}>
            <Container p={0} className={cx({ [classes.hidden]: !isPaymentCardModalOpened })}>
              <PaymentCard onCancel={() => setIsPaymentCardModalOpened(false)} />
            </Container>

            <Button
              variant="outline"
              display={isPaymentCardModalOpened ? 'none' : 'block'}
              onClick={() => setIsPaymentCardModalOpened(!isPaymentCardModalOpened)}
            >
              Change payment method
            </Button>
          </Container>
        </Group>
      )}

      <Group grow>
        <PaymentHistory />
      </Group>
    </>
  );
};

export default CurrentPlan;
