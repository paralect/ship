import { FC } from 'react';
import { Card, Grid, Stack, Text } from '@mantine/core';

import { User } from 'types';

import { USER_CARD_FIELDS } from './constants';

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

const UserCard: FC<UserCardProps> = ({ user, onClick }) => {
  const userCardFields = USER_CARD_FIELDS.map((field) => {
    return (
      <Grid key={field.key}>
        <Grid.Col span={6}>
          <Text fw={500}>{field.label}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text truncate maw={150}>
            {user[field.key] as string}
          </Text>
        </Grid.Col>
      </Grid>
    );
  });

  return (
    <Card shadow="sm" radius="md" withBorder onClick={() => onClick(user)}>
      <Stack gap="sm">{userCardFields}</Stack>
    </Card>
  );
};

export default UserCard;
