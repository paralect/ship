import React, { FC, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Container, Flex, Stack, Text } from '@mantine/core';
import useChatData from 'pages/open-ai/hooks/useChatData';

import { aiChatApi } from 'resources/ai-chat/index';

import { AIMessage, ChatRoleType } from 'types';

import GuideOptions from '../GuideOptions';
import MessageInput from '../MessageInput';
import MessageList from '../MessageList';

const GUIDE_OPTIONS = [
  {
    title: 'ChatGPT started guide',
    content: 'This is the content for ChatGPT started guide',
  },
  {
    title: 'ChatGPT started guide 2',
    content: 'This is the content for ChatGPT started guide 2',
  },
  {
    title: 'ChatGPT started guide 3',
    content: 'This is the content for ChatGPT started guide 3',
  },
];

interface ChatBoxProps {
  selectedChatId: string | null;
  onChatSelect: (chatId: string | null) => void;
}

const ChatBox: FC<ChatBoxProps> = ({ selectedChatId, onChatSelect }) => {
  const { data: chat } = aiChatApi.useSelectedChat({ chatId: selectedChatId });

  const chatParent = useRef<HTMLDivElement>(null);
  const prevChatId = useRef<string | null>(selectedChatId);

  const [localMessages, setLocalMessages] = useState<AIMessage[]>(() => chat?.messages || []);

  const addLocalMessage = useCallback((message: AIMessage) => {
    setLocalMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { fetchData, isLoading, streamParts } = useChatData(onChatSelect, addLocalMessage);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  useLayoutEffect(() => {
    if (![selectedChatId, null].includes(prevChatId.current) && chat?.messages.length) {
      setLocalMessages(chat.messages);
      prevChatId.current = selectedChatId;
    }
    if (!selectedChatId) {
      setLocalMessages([]);
    }
  }, [selectedChatId, chat]);

  const handleSendMessage = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();

      addLocalMessage({
        role: ChatRoleType.USER,
        content: trimmedValue,
        id: crypto.randomUUID(),
      });
      fetchData({ requestTextValue: trimmedValue, chatId: selectedChatId });
    },
    [selectedChatId, fetchData],
  );

  const handleOptionClick = ({ requestTextValue, chatId }: { requestTextValue: string; chatId: string | null }) => {
    addLocalMessage({
      role: ChatRoleType.USER,
      content: requestTextValue,
      id: crypto.randomUUID(),
    });
    fetchData({ requestTextValue, chatId });
  };

  return (
    <Flex direction="column" justify="flex-start" bg="white" w="100%" pos="relative" pb="65px" h="100%">
      {!selectedChatId && !localMessages.length && (
        <Stack gap="xl" h="100%" justify="center" align="center">
          <Text fw={700}>Ship AI-Chat</Text>
          <GuideOptions options={GUIDE_OPTIONS} onOptionClick={handleOptionClick} />
        </Stack>
      )}
      <Flex
        ref={chatParent}
        flex="flex"
        p={20}
        justify="flex-start"
        style={{
          overflowY: 'scroll',
          flexDirection: 'column',
        }}
      >
        <MessageList messages={localMessages} isLoading={isLoading} streamParts={streamParts} />
      </Flex>

      <Container pos="absolute" bottom={10} right={10} left={10}>
        <MessageInput onSendMessage={handleSendMessage} />
      </Container>
    </Flex>
  );
};

export default memo(ChatBox);
