import { FC, memo } from 'react';
import Link from 'next/link';
import { useApiQuery } from 'hooks';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';

import UserMenu from './components/UserMenu';

const Header: FC = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white">
      <div className="flex h-[72px] items-center justify-between px-8">
        <Link href={RoutePath.Home}>
          <LogoImage />
        </Link>

        <UserMenu />
      </div>
    </header>
  );
};

export default memo(Header);
