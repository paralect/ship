import Link from 'next/link';
import { memo, FC } from 'react';
import { Menu } from '@mantine/core';
import { IconUserCircle, IconLogout } from '@tabler/icons';

import { accountApi } from 'resources/account';

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
          component={Link}
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
