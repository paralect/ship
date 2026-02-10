import { FC } from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import MenuToggle from '../MenuToggle';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu: FC = () => {
  const { mutate: signOut } = accountApi.useSignOut();

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

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
