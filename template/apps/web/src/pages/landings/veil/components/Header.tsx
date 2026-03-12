import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApiQuery } from 'hooks';
import { Moon, Sun } from 'lucide-react';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { Button } from './ui/button';

export const Header = () => {
  const { data: account } = useApiQuery(apiClient.account.get);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <LogoImage className="h-6" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              FAQ
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 hidden dark:block" />
            <Moon className="size-4 block dark:hidden" />
          </Button>

          {account ? (
            <Button asChild>
              <Link href="/app">Go to app</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
