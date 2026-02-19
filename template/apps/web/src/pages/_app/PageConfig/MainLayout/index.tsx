import { FC, ReactElement } from 'react';
import { useApiQuery } from 'hooks';

import { apiClient } from 'services/api-client.service';

import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default MainLayout;
