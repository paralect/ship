import { FC, ReactNode } from 'react';

import PublicHeader from '@/components/PublicHeader';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <PublicHeader />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default PublicLayout;
