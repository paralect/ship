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
      <Menu.Dropdown
        sx={(theme) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.colors.gray[4]}`,
          right: '30px !important',
          left: 'unset !important',
        })}
      >
        <Menu.Item
          component={Link}
          href="/profile"
          icon={<IconUserCircle size={16} />}
        >
          Profile settings
        </Menu.Item>
        <Menu.Item
          onClick={() => signOut()}
          icon={<IconLogout size={16} />}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(UserMenu);
