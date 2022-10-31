import { useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  Stack,
  Tabs,
  Title,
} from '@mantine/core';
import SubscriptionPlans from 'pages/pricing-plans/components/plans';

import { showNotification } from '@mantine/notifications';
import { RoutePath } from 'routes';

import CurrentPlan from './components/current-plan';

const getNotificationMessage = (paymentIntentStatus: string) => {
  switch (paymentIntentStatus) {
    case 'succeeded':
      return {
        title: 'Success',
        message: 'Success! Your payment method has been saved.',
        color: 'green',
      };
    case 'requires_payment_method':
      return {
        title: 'Error',
        message: 'Failed to process payment details. Please try another payment method.',
        color: 'red',
      };
    default:
      return {
        title: 'Processing',
        message: 'Processing payment details. We will update you when processing is complete.',
      };
  }
};

const AccountPlan: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirect_status) {
      router.replace(RoutePath.AccountPlan, undefined, { shallow: true });
      showNotification(getNotificationMessage(router.query.redirect_status as string));
    }
  }, [router, router.query.redirect_status]);

  return (
    <>
      <Head>
        <title>Account plan</title>
      </Head>
      <Stack
        sx={{
          maxWidth: '1280px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        <Title>Account Plan</Title>
        <Tabs defaultValue="billing">
          <Tabs.List grow>
            <Tabs.Tab color="blue" value="billing">Billing</Tabs.Tab>
            <Tabs.Tab color="blue" value="plans">Plans</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel sx={{ marginTop: '32px' }} value="billing">
            <CurrentPlan />
          </Tabs.Panel>

          <Tabs.Panel sx={{ marginTop: '32px' }} value="plans">
            <SubscriptionPlans />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
};

export default AccountPlan;
