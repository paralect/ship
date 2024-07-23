import React, { FC, memo } from 'react';
import { Box, Loader, Space } from '@mantine/core';

import { AIMessage, ChatRoleType } from 'types';

import CustomPre from '../CustomPre';
import DynamicMessage from '../DynamicMessage';

import classes from './index.module.css';

interface MessageListProps {
  messages: AIMessage[];
  isLoading: boolean;
  streamParts: string[];
}

const MessageList: FC<MessageListProps> = ({ messages, isLoading, streamParts }) => {
  const renderMessages = () =>
    messages.map((msg: AIMessage) => {
      if (msg.role === ChatRoleType.USER) {
        return (
          <React.Fragment key={msg.id}>
            <Box className={classes.container}>
              <CustomPre>{`${msg.content}`}</CustomPre>
            </Box>
            <Space h="xs" />
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={msg.id}>
          <CustomPre>{`${msg.content}`}</CustomPre>
          <Space h="xs" />
        </React.Fragment>
      );
    });

  return (
    <>
      {renderMessages()}
      {isLoading && <Loader color="gray" size="xs" type="dots" />}
      {streamParts.length > 0 && <DynamicMessage streamParts={streamParts} />}
    </>
  );
};

export default memo(MessageList);
