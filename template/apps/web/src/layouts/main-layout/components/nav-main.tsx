import { Link, useLocation } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks';
import { Home, Users } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const NavMain = () => {
  const location = useLocation();
  const { data: currentUser } = useCurrentUser();
  const currentPath = location.pathname;

  const items = [
    { title: 'Dashboard', url: '/app', icon: Home },
    ...(currentUser?.isAdmin ? [{ title: 'Admin', url: '/app/admin', icon: Users }] : []),
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavMain;
