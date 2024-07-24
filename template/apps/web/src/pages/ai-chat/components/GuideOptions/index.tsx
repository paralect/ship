import React, { FC, memo } from 'react';
import { Flex, Paper, Stack, Text } from '@mantine/core';

import { GuideOption } from 'types';

import classes from './index.module.css';

interface GuideOptionsProps {
  options: GuideOption[];
  onOptionClick: ({ requestTextValue, chatId }: { requestTextValue: string; chatId: string | null }) => void;
}

const GuideOptions: FC<GuideOptionsProps> = ({ options, onOptionClick }) => (
  <Stack gap="xl" h="100%" justify="center" align="center">
    <Text fw={700}>Ship AI-Chat</Text>
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
  </Stack>
);

export default memo(GuideOptions);
