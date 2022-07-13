import { forwardRef, memo } from 'react';
import { userApi } from 'resources/user';
import { Avatar, UnstyledButton } from '@mantine/core';

const MenuToggle = forwardRef((props, ref) => {
  const { data: user } = userApi.useGetCurrent();

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
