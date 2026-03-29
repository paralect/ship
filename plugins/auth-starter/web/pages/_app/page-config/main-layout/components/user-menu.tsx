import Link from 'next/link';
import { useTheme } from 'next-themes';
import { queryKey, useCurrentUser } from 'hooks';
import { LogOut, Moon, Sun, User } from 'lucide-react';

import { authClient } from 'services/auth-client.service';

import queryClient from 'query-client';

import { apiClient } from 'services/api-client.service';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  isCollapsed: boolean;
}

const UserMenu = ({ isCollapsed }: UserMenuProps) => {
  const { data: currentUser } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.setQueryData(queryKey(apiClient.users.getCurrent), null);
  };

  if (!currentUser) return null;

  const initials = currentUser.fullName
    ? currentUser.fullName
        .split(' ')
        .map((n: string) => n.charAt(0))
        .slice(0, 2)
        .join('')
    : '';

  return (
    <div className="border-t p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn('w-full justify-start gap-2', isCollapsed && 'justify-center px-0')}>
            <Avatar size="sm">
              <AvatarImage src={currentUser.avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {!isCollapsed && <span className="truncate text-sm">{currentUser.fullName}</span>}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={isCollapsed ? 'center' : 'start'} side="top">
          <DropdownMenuItem asChild>
            <Link href="/app/settings/profile">
              <User className="mr-2 size-4" />
              Profile settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
