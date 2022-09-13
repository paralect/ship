import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
  Container
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { userApi } from 'resources/user';

import AddMembersModal from './components/AddMembersModal';
import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header = () => {
  const { data: user } = userApi.useGetCurrent();

  return (
    <LayoutHeader
      component="header"
    >
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
        <Link type="router" href={routes.path.home} withoutUnderline>
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
