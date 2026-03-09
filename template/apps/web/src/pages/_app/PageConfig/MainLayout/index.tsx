import { FC, ReactNode, useState } from 'react';
import Link from 'next/link';
import { useApiQuery } from 'hooks';
import { PanelLeft } from 'lucide-react';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { Navigation, UserMenu } from './components';
import Navbar from './Navbar';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { data: account } = useApiQuery(apiClient.account.get);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!account) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/40 md:flex-row">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeft className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex w-72 flex-col p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle>
                <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogoImage className="h-6" />
                </Link>
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <Navigation isCollapsed={false} />
              </div>
            </ScrollArea>

            <UserMenu isCollapsed={false} />
          </SheetContent>
        </Sheet>

        <Link href="/app">
          <LogoImage className="h-6" />
        </Link>
      </header>

      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
