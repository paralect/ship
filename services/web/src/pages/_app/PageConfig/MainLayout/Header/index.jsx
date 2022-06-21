import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';

const Header = () => (
  <LayoutHeader component="header">
    <Link type="router" href={routes.path.home} withoutUnderline>
      <LogoImage />
    </Link>
    <UserMenu />
  </LayoutHeader>
);

export default memo(Header);
