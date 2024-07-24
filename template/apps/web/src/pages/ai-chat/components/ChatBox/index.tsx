import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { Container, Flex } from '@mantine/core';
import { useChat, UseChatOptions } from 'ai/react';

import config from 'config/index';

import { ChatRoleType, GuideOption } from 'types';

import GuideOptions from '../GuideOptions';
import MessageInput from '../MessageInput';
import MessageList from '../MessageList';

import classes from './index.module.css';

const GUIDE_OPTIONS: GuideOption[] = [
  {
    title: 'Started with AI Chat',
    content: 'This is the content for Getting Started with AI Chat',
  },
  {
    title: 'Basic AI Chat Features',
    content: 'This is the content for Basic AI Chat Features',
  },
  {
    title: 'Advanced AI Chat Tips',
    content: 'This is the content for Advanced AI Chat Tips',
  },
];

const DEFAULT_CHAT_OPTIONS: UseChatOptions = {
  api: `${config.API_URL}/ai-chat`,
  credentials: 'include',
  streamMode: 'text',
  keepLastMessageOnError: true,
};

const ChatBox: FC = () => {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, stop } = useChat(DEFAULT_CHAT_OPTIONS);

  const chatParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const handleOptionClick = useCallback(async ({ requestTextValue }: { requestTextValue: string }) => {
    await append({
      role: ChatRoleType.USER,
      content: requestTextValue,
    });
  }, []);

  const handleStop = useCallback(() => {
    stop();
  }, []);

  return (
    <Flex direction="column" justify="flex-start" bg="white" w="100%" pos="relative" pb="65px" h="100%">
      {!messages.length && <GuideOptions options={GUIDE_OPTIONS} onOptionClick={handleOptionClick} />}

      <Flex ref={chatParent} className={classes.list}>
        <MessageList messages={messages} />
      </Flex>

      <Container pos="absolute" bottom={10} right={10} left={10}>
        <MessageInput
          inputValue={input}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onStop={handleStop}
        />
      </Container>
    </Flex>
  );
};

export default memo(ChatBox);
