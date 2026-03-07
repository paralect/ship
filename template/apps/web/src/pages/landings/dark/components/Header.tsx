import Link from 'next/link';
import { useApiQuery } from 'hooks';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const Header = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoImage className="h-6" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {account ? (
            <Button asChild variant="secondary">
              <Link href="/app">Go to app</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
