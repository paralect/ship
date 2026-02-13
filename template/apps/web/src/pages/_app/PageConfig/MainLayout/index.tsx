import { FC, ReactElement } from 'react';
import { useApiQuery } from 'hooks';

import { apiClient } from 'services/api-client.service';

import Header from './Header';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />

      <main className="flex-1 p-8 pt-[104px]">{children}</main>
    </div>
  );
};

export default MainLayout;
