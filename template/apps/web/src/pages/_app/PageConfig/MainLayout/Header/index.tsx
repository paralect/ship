import { memo, FC } from 'react';
import { Anchor, AppShellHeader as LayoutHeader, Container } from '@mantine/core';
import Link from 'next/link';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

import classes from './index.module.css';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <LayoutHeader>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        className={classes.header}
        mih={72}
        px={32}
        py={0}
        display="flex"
        fluid
      >
        <Anchor
          component={Link}
          href={RoutePath.Home}
        >
          <LogoImage />
        </Anchor>
        <UserMenu />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
