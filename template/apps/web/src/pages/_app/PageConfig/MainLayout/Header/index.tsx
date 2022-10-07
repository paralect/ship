import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { userApi } from 'resources/user';

import AddMembersModal from './components/AddMembersModal';
import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header: FC = () => {
  const { data: user } = userApi.useGetCurrent();

  if (!user) return null;

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
      {user.isShadow && <ShadowLoginBanner />}
    </LayoutHeader>
  );
};

export default memo(Header);
