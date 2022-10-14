import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import AddMembersModal from './components/AddMembersModal';
import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <LayoutHeader height="72px">
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          backgroundColor: theme.black,
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 auto',
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <AddMembersModal />
        <UserMenu />
      </Container>
      {account.isShadow && <ShadowLoginBanner />}
    </LayoutHeader>
  );
};

export default memo(Header);
