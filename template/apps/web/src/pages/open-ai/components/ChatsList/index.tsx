import React, { memo } from 'react';
import { Flex, Paper, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';

import { aiChatApi } from 'resources/ai-chat';

interface ChatListProps {
  onChatSelect: (chatId: string | null) => void;
  selectedChat: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect, selectedChat }) => {
  const { data: chats, isLoading } = aiChatApi.useList();

  const handleCreateNewChat = async () => {
    onChatSelect(null);
  };

  return (
    <Paper w={300} h="100%" style={{ borderRight: '1px solid #ccc', borderRadius: 0 }}>
      <Stack gap="xs" h="100%">
        <Flex justify="space-between" align="flex-start" p={10}>
          <Text fw={700}>Chats</Text>
          <UnstyledButton onClick={handleCreateNewChat}>&#10133;</UnstyledButton>
        </Flex>
        <ScrollArea style={{ flexGrow: 1 }} p="xs">
          <Stack gap="xs">
            {isLoading && <Text>Loading...</Text>}
            {chats?.results?.map((chat) => (
              <UnstyledButton
                key={chat._id}
                p="5px 10px"
                maw={200}
                style={{
                  borderRadius: '8px',
                  ...(chat._id === selectedChat && { backgroundColor: '#ececec' }),
                }}
                onClick={() => onChatSelect(chat._id)}
              >
                <Text truncate="end">{chat.title}</Text>
              </UnstyledButton>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Paper>
  );
};

export default memo(ChatList);
