import Link from 'next/link';
import { memo, FC } from 'react';
import { Menu } from '@mantine/core';
import { IconUserCircle, IconLogout } from '@tabler/icons-react';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import MenuToggle from '../MenuToggle';

import classes from './index.module.css';

const UserMenu: FC = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu>
      <Menu.Target>
        <MenuToggle />
      </Menu.Target>
      <Menu.Dropdown className={classes.dropdown}>
        <Menu.Item
          component={Link}
          href={RoutePath.Profile}
          leftSection={<IconUserCircle size={16} />}
        >
          Profile settings
        </Menu.Item>

        <Menu.Item
          onClick={() => signOut()}
          leftSection={<IconLogout size={16} />}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(UserMenu);
