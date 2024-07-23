import { useCallback, useState } from 'react';
import React, { NextPage } from 'next';
import Head from 'next/head';
import { Container, Flex, Stack, Title } from '@mantine/core';

import ChatBox from './components/ChatBox';
import ChatList from './components/ChatsList';

import classes from './index.module.css';

const OpenAI: NextPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleSelectChat = useCallback((chatId: string | null) => {
    setSelectedChat(chatId);
  }, []);

  return (
    <>
      <Head>
        <title>OpenAI</title>
      </Head>

      <Stack gap="lg">
        <Title order={2}>OpenAI</Title>
      </Stack>
      <Container mt="md" className={classes.container}>
        <Flex align="flex-start" justify="space-between" h="100%">
          <ChatList onChatSelect={handleSelectChat} selectedChat={selectedChat} />
          <ChatBox onChatSelect={handleSelectChat} selectedChatId={selectedChat} />
        </Flex>
      </Container>
    </>
  );
};

export default OpenAI;
