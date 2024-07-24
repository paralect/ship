import React, { NextPage } from 'next';
import Head from 'next/head';
import { Container, Stack, Title } from '@mantine/core';

import ChatBox from './components/ChatBox';

import classes from './index.module.css';

const OpenAI: NextPage = () => (
  <>
    <Head>
      <title>AI Chat</title>
    </Head>

    <Stack gap="lg">
      <Title order={2}>AI Chat</Title>
    </Stack>
    <Container mt="md" className={classes.container}>
      <ChatBox />
    </Container>
  </>
);

export default OpenAI;
