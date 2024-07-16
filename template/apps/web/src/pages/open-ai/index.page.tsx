import React, { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';

const OpenAI: NextPage = () => (
  <>
    <Head>
      <title>OpenAi</title>
    </Head>

    <Stack gap="lg">
      <Title order={2}>OpenAI</Title>
    </Stack>
  </>
);

export default OpenAI;
