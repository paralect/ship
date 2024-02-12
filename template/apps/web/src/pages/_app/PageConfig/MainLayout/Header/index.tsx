import { memo, FC } from 'react';
import { Anchor, AppShell, Group } from '@mantine/core';
import Link from 'next/link';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <AppShell.Header>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}

      <Group h={72} px={32} py={0} justify="space-between" bg="white">
        <Anchor
          component={Link}
          href={RoutePath.Home}
        >
          <LogoImage />
        </Anchor>

        <UserMenu />
      </Group>
    </AppShell.Header>
  );
};

export default memo(Header);
