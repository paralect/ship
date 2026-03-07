import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { useApiQuery } from 'hooks';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <LogoImage className="h-6" />
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {account ? (
              <Button asChild variant="secondary">
                <Link href="/">Go to app</Link>
              </Button>
            ) : (
              <Button asChild variant="secondary">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default PublicLayout;
