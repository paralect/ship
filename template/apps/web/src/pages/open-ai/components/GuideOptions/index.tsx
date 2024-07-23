import React from 'react';
import { Flex, Paper, Text } from '@mantine/core';

import classes from './index.module.css';

interface Option {
  title: string;
  content: string;
}

interface GuideOptionsProps {
  options: Option[];
  onOptionClick: ({ requestTextValue, chatId }: { requestTextValue: string; chatId: string | null }) => void;
}

const GuideOptions: React.FC<GuideOptionsProps> = ({ options, onOptionClick }) => (
  <Flex justify="center" align="center" gap={25}>
    {options.map((option) => (
      <Paper
        key={option.title}
        shadow="xs"
        radius="lg"
        withBorder
        p="md"
        className={classes.option}
        maw={150}
        onClick={() => onOptionClick({ requestTextValue: option.content, chatId: null })}
      >
        <Text>{option.title}</Text>
      </Paper>
    ))}
  </Flex>
);

export default GuideOptions;
