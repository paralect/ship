import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
  Group,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';

const Header = () => (
  <LayoutHeader
    component="header"
    sx={(theme) => ({
      minHeight: '72px',
      padding: '0 32px',
      backgroundColor: theme.black,
      display: 'flex',
      alignItems: 'center',
      flex: '0 1 auto',
    })}
  >
    <Link type="router" href={routes.path.home} withoutUnderline>
      <LogoImage />
    </Link>
    <UserMenu />
  </LayoutHeader>
);

export default memo(Header);
