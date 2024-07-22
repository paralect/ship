import React, { FC, memo, useState } from 'react';
import { Button, Textarea } from '@mantine/core';

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
    <div style={{ display: 'flex', gap: '10px' }}>
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
      <Button size="s" style={{ flexShrink: 0 }} onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};

export default memo(MessageInput);
