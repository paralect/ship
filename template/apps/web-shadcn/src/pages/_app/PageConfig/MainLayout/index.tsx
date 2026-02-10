import { FC, ReactElement } from 'react';

import { accountApi } from 'resources/account';

import Header from './Header';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />

      <main className="flex-1 p-8 pt-[104px]">{children}</main>
    </div>
  );
};

export default MainLayout;
