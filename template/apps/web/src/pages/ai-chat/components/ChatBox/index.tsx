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

const DEFAULT_CHAT_OPTIONS: UseChatOptions = {
  api: `${config.API_URL}/ai-chat`,
  credentials: 'include',
  streamMode: 'text',
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

  const handleOptionClick = async ({ requestTextValue }: { requestTextValue: string }) => {
    await append({
      role: ChatRoleType.USER,
      content: requestTextValue,
    });
  };

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
          onSubmit={handleSubmit}
          inputValue={input}
          onChange={handleInputChange}
          onStop={handleStop}
          isLoading={isLoading}
        />
      </Container>
    </Flex>
  );
};

export default memo(ChatBox);
