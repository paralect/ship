import Link from 'next/link';
import { useRouter } from 'next/router';
import { CreditCard, Home, LucideIcon, Users } from 'lucide-react';

import { RoutePath } from 'routes';

import ChatNavigation from './ChatNavigation';

import { cn } from '@/lib/utils';

interface NavigationProps {
  isCollapsed: boolean;
}

const navLinks: { href: RoutePath; label: string; icon: LucideIcon }[] = [
  { href: RoutePath.Home, label: 'Dashboard', icon: Home },
  { href: RoutePath.Admin, label: 'Admin', icon: Users },
  { href: RoutePath.Pricing, label: 'Pricing', icon: CreditCard },
];

const Navigation = ({ isCollapsed }: NavigationProps) => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="flex flex-col gap-1 p-2">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}>
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
              currentPath === href && 'bg-muted',
              isCollapsed && 'justify-center px-0',
            )}
            title={isCollapsed ? label : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
          </div>
        </Link>
      ))}

      <ChatNavigation isCollapsed={isCollapsed} />
    </div>
  );
};

export default Navigation;
