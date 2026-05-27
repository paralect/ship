import { Link, useLocation } from '@tanstack/react-router';
import { Home } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const NavMain = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Top-level nav entries. Plugins (e.g. admin) extend this list when installed.
  const items = [
    { title: 'Dashboard', url: '/app', icon: Home },
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
