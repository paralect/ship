import { forwardRef, memo } from 'react';
import { Avatar, UnstyledButton } from '@mantine/core';

import { userApi } from 'resources/user';

const MenuToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { data: user } = userApi.useGetCurrent();

  if (!user) return null;

  return (
    <UnstyledButton ref={ref} {...props}>
      <Avatar color="gray" radius="xl">
        {user.firstName.charAt(0)}
        {user.lastName.charAt(0)}
      </Avatar>
    </UnstyledButton>
  );
});

export default memo(MenuToggle);
