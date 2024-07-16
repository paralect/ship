import React, { FC, memo } from 'react';
import Link from 'next/link';
import { Anchor, AppShell, Group } from '@mantine/core';

import { accountApi } from 'resources/account';

import { LogoImage } from 'public/images';

import { RoutePath } from 'routes';

import NavBar from './components/NavBar';
import ShadowLoginBanner from './components/ShadowLoginBanner';
import UserMenu from './components/UserMenu';

const DEFAULT_NAVBAR_OPTIONS = [
  { label: 'Home', path: RoutePath.Home },
  { label: 'OpenAI', path: RoutePath.OpenAI },
];

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <AppShell.Header>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}

      <Group h={72} px={32} py={0} justify="space-between" bg="white">
        <Group justify="flex-start" gap={50}>
          <Anchor component={Link} href={RoutePath.Home}>
            <LogoImage />
          </Anchor>
          <NavBar options={DEFAULT_NAVBAR_OPTIONS} />
        </Group>

        <UserMenu />
      </Group>
    </AppShell.Header>
  );
};

export default memo(Header);
