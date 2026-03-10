import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavigationProps {
  isCollapsed: boolean;
}

const Navigation = ({ isCollapsed }: NavigationProps) => {
  const router = useRouter();

  const currentPath = router.pathname;

  return (
    <div className="flex flex-col gap-1 p-2">
      <Link href="/app">
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
            currentPath === '/app' && 'bg-muted',
            isCollapsed && 'justify-center px-0',
          )}
          title={isCollapsed ? 'Dashboard' : undefined}
        >
          <Home className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
        </div>
      </Link>

      <Link href="/app/admin">
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
            currentPath === '/app/admin' && 'bg-muted',
            isCollapsed && 'justify-center px-0',
          )}
          title={isCollapsed ? 'Admin' : undefined}
        >
          <Users className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Admin</span>}
        </div>
      </Link>
    </div>
  );
};

export default Navigation;
