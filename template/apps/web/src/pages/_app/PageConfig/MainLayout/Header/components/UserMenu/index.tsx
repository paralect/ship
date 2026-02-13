import { FC } from 'react';
import Link from 'next/link';
import { useApiMutation } from 'hooks';
import { LogOut, User } from 'lucide-react';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';
import queryClient from 'query-client';

import MenuToggle from '../MenuToggle';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu: FC = () => {
  const { mutate: signOut } = useApiMutation(apiClient.account.signOut, {
    onSuccess: () => {
      queryClient.setQueryData([apiClient.account.get.path], null);
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MenuToggle />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={RoutePath.Profile}>
            <User className="mr-2 size-4" />
            Profile settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut({})}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
