import React, { ChangeEvent, FC, memo } from 'react';
import { Button, Flex, Textarea } from '@mantine/core';

import classes from './index.module.css';

interface MessageInputProps {
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
}

const MessageInput: FC<MessageInputProps> = ({ inputValue, onSubmit, onChange, onStop, isLoading }) => (
  <Flex gap={10} align="flex-end">
    <Textarea
      w="100%"
      value={inputValue}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          onSubmit();
        }
      }}
      autosize
      minRows={1}
      maxRows={10}
      disabled={isLoading}
    />
    <Button
      size="s"
      onClick={() => {
        if (isLoading) {
          onStop();
        } else {
          onSubmit();
        }
      }}
      className={classes.button}
      disabled={!isLoading && !inputValue}
    >
      {isLoading ? 'Stop' : 'Send'}
    </Button>
  </Flex>
);
export default memo(MessageInput);
