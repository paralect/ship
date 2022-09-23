import { memo, FC } from 'react';
import { accountApi } from 'resources/account';
import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconUserCircle, IconLogout } from '@tabler/icons';

import MenuToggle from '../MenuToggle';

const UserMenu: FC = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu>
      <Menu.Target>
        <MenuToggle />
      </Menu.Target>
      <Menu.Dropdown>
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
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(UserMenu);
