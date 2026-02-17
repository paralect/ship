import { FC, ReactElement } from 'react';
import { useApiQuery } from 'hooks';

import { apiClient } from 'services/api-client.service';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/40">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default MainLayout;
