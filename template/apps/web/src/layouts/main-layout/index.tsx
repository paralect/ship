import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@/hooks';

import AppSidebar from './app-sidebar';
import SiteHeader from './site-header';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
