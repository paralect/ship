import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Space, Title } from '@mantine/core';

import Plans from './components/plans';

const SubscriptionPlans: NextPage = () => (
  <>
    <Head>
      <title>Pricing plans</title>
    </Head>

    <Title style={{ textAlign: 'center' }} order={1}>
      Pricing plans
    </Title>

    <Space h={16} />

    <Plans />
  </>
);

export default SubscriptionPlans;
