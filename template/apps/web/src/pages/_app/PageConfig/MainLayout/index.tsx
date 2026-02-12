import { FC, ReactElement } from 'react';
import { AppShell, Stack } from '@mantine/core';
import { useApiQuery } from 'hooks/use-api.hook';

import { apiClient } from 'services/api-client.service';

import Header from './Header';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <AppShell component={Stack} bg="gray.0">
      <Header />

      <AppShell.Main p={32} pt={104}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
