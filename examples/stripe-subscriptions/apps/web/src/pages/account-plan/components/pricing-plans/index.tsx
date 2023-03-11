import Head from 'next/head';
import { NextPage } from 'next';

import { Title, Space } from '@mantine/core';

import Plans from './components/plans';

const SubscriptionPlans: NextPage = () => (
  <>
    <Head>
      <title>Pricing plans</title>
    </Head>

    <Title align="center">Pricing plans</Title>

    <Space h={16} />

    <Plans />
  </>
);

export default SubscriptionPlans;
