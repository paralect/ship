import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApiMutation, useApiQuery } from 'hooks';
import { LogOut, Moon, Sun, User } from 'lucide-react';

import { apiClient } from 'services/api-client.service';

import queryClient from 'query-client';

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
  const { data: account } = useApiQuery(apiClient.account.get);
  const { theme, setTheme } = useTheme();

  const { mutate: signOut } = useApiMutation(apiClient.account.signOut, {
    onSuccess: () => {
      queryClient.setQueryData([apiClient.account.get.path], null);
    },
  });

  if (!account) return null;

  return (
    <div className="border-t p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn('w-full justify-start gap-2', isCollapsed && 'justify-center px-0')}>
            <Avatar size="sm">
              <AvatarImage src={account.avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>
                {account.firstName.charAt(0)}
                {account.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <span className="truncate text-sm">
                {account.firstName} {account.lastName}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={isCollapsed ? 'center' : 'start'} side="top">
          <DropdownMenuItem asChild>
            <Link href="/app/profile">
              <User className="mr-2 size-4" />
              Profile settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => signOut({})}>
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
