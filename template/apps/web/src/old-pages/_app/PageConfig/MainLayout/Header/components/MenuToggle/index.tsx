import { FC } from 'react';
import { Avatar, UnstyledButton, UnstyledButtonProps, useMantineTheme } from '@mantine/core';

import { accountApi } from 'resources/account';

const MenuToggle: FC<UnstyledButtonProps> = (props) => {
  const { primaryColor } = useMantineTheme();

  const { data: account } = accountApi.useGet();

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
