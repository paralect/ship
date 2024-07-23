import React, { FC, memo, useState } from 'react';
import { Button, Flex, Textarea } from '@mantine/core';

import classes from './index.module.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <Flex gap={10}>
      <Textarea
        w="100%"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        autosize
        minRows={1}
        maxRows={4}
      />
      <Button size="s" className={classes.button} onClick={handleSendMessage}>
        Send
      </Button>
    </Flex>
  );
};

export default memo(MessageInput);
