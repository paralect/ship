import { useCallback, useState } from 'react';
import React, { NextPage } from 'next';
import Head from 'next/head';
import { Container, Flex, Stack, Title } from '@mantine/core';

import ChatBox from './components/ChatBox';
import ChatList from './components/ChatsList/index';

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
      <Container
        w="100%"
        mt="md"
        bd="1px solid #ccc"
        p={0}
        h="calc(100vh - 200px)"
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Flex align="flex-start" justify="space-between" h="100%">
          <ChatList onChatSelect={handleSelectChat} selectedChat={selectedChat} />
          <ChatBox onChatSelect={handleSelectChat} selectedChatId={selectedChat} />
        </Flex>
      </Container>
    </>
  );
};

export default OpenAI;
