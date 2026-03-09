import { FC } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApiQuery } from 'hooks';
import { Moon, Sun } from 'lucide-react';

import { LogoImage } from 'public/images';

import { apiClient } from 'services/api-client.service';

import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blog', href: '/blog' },
];

const PublicHeader: FC = () => {
  const { data: account } = useApiQuery(apiClient.account.get);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <LogoImage className="h-8" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground hover:tracking-[0.2em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="font-mono hover:bg-muted"
          >
            <Sun className="size-5 hidden dark:block" />
            <Moon className="size-5 block dark:hidden" />
          </Button>

          <div className="flex items-center gap-4">
            {account ? (
              <Button
                className="border-2 border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                asChild
              >
                <Link href="/app">Go to app</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="font-mono text-xs font-black uppercase tracking-widest hover:bg-muted"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="border-2 border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  asChild
                >
                  <Link href="/sign-up">Ship Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
