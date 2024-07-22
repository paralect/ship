import React, { FC, memo } from 'react';
import { Box, Loader } from '@mantine/core';

import { AIMessage, ChatRoleType } from 'types';

import CustomPre from '../CustomPre/index';
import DynamicMessage from '../DynamicMessage';

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
            <Box
              bg="pink"
              p={5}
              maw="70%"
              c="white"
              style={{
                alignSelf: 'flex-end',
                flexGrow: 0,
                borderRadius: 8,
              }}
            >
              <CustomPre>{`${msg.content}`}</CustomPre>
            </Box>
            <br />
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={msg.id}>
          <CustomPre>{`${msg.content}`}</CustomPre>
          <br />
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
