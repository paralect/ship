import { FC, ReactElement } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApiQuery } from 'hooks';
import { Moon, Sun } from 'lucide-react';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';

import { Button } from '@/components/ui/button';

interface PublicLayoutProps {
  children: ReactElement;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
        <Link href={RoutePath.Blog}>
          <LogoImage className="h-6" />
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          {account ? (
            <Button asChild>
              <Link href={RoutePath.Home}>Go to app</Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href={RoutePath.SignIn}>Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default PublicLayout;
