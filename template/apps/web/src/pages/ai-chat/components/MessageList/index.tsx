import React, { FC, memo } from 'react';
import { Text } from '@mantine/core';
import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib/react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { ChatRoleType } from 'types';

import 'highlight.js/styles/github.css';
import classes from './index.module.css';

interface MessageListProps {
  messages: Message[];
}

const MessageList: FC<MessageListProps> = ({ messages }) => {
  const renderMessages = () =>
    messages.map((msg: Message) => {
      if (msg.role === ChatRoleType.USER) {
        return (
          <Text key={msg.id} className={classes.container}>
            {msg.content.toString()}
          </Text>
        );
      }

      return (
        <ReactMarkdown key={msg.id} rehypePlugins={[rehypeHighlight] as PluggableList}>
          {msg.content.trim()}
        </ReactMarkdown>
      );
    });

  return <>{renderMessages()}</>;
};

export default memo(MessageList);
