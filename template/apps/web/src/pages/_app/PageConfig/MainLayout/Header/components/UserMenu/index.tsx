import React, { FC } from 'react';
import Link from 'next/link';
import { Menu } from '@mantine/core';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import MenuToggle from '../MenuToggle';

const UserMenu: FC = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <MenuToggle />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item component={Link} href={RoutePath.Profile} leftSection={<IconUserCircle size={16} />}>
          Profile settings
        </Menu.Item>

        <Menu.Item onClick={() => signOut()} leftSection={<IconLogout size={16} />}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
