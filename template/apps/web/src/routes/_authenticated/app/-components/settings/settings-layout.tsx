import { FC, ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Profile', href: '/app/settings/profile' },
  { label: 'Security', href: '/app/settings/security' },
] as const;

interface SettingsLayoutProps {
  title: string;
  children: ReactNode;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6 sm:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="mt-6">
        <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-muted p-1 text-muted-foreground">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                location.pathname === tab.href
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-background/50 hover:text-foreground',
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
