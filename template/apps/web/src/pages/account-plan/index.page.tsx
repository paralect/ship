import Head from 'next/head';
import { NextPage } from 'next';
import {
  Stack,
  Tabs,
  Title,
} from '@mantine/core';

import SubscriptionPlans from 'pages/pricing-plans/components/plans';
import CurrentPlan from './components/current-plan';

const AccountPlan: NextPage = () => (
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

export default AccountPlan;
