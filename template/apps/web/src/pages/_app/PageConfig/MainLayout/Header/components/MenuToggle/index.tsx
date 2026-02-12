import { FC } from 'react';
import { Avatar, UnstyledButton, UnstyledButtonProps, useMantineTheme } from '@mantine/core';
import { useApiQuery } from 'hooks/use-api.hook';

import { apiClient } from 'services/api-client.service';

const MenuToggle: FC<UnstyledButtonProps> = (props) => {
  const { primaryColor } = useMantineTheme();

  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <UnstyledButton aria-label="Menu Toggle" {...props}>
      <Avatar src={account.avatarUrl} color={primaryColor} radius="xl" alt="Avatar">
        {account.firstName.charAt(0)}
        {account.lastName.charAt(0)}
      </Avatar>
    </UnstyledButton>
  );
};

export default MenuToggle;
