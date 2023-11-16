import { memo, FC } from 'react';
import { AppShellHeader as LayoutHeader, Container } from '@mantine/core';

import { accountApi } from 'resources/account';

import { Link } from 'components';
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
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <UserMenu />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
