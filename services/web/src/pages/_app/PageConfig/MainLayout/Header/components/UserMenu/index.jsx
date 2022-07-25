import { memo } from 'react';
import { accountApi } from 'resources/account';
import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconUserCircle, IconLogout } from '@tabler/icons';
import MenuToggle from '../MenuToggle';

const UserMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu
      sx={{ marginLeft: 'auto' }}
      control={<MenuToggle />}
    >
      <Menu.Item
        component={NextLink}
        href="/profile"
        icon={<IconUserCircle size={16} />}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        onClick={() => signOut()}
        icon={<IconLogout size={16} />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default memo(UserMenu);
