import { Link, useLocation, useRouter } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavEntry {
  label: string;
  icon: LucideIcon;
  order?: number;
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    nav?: NavEntry;
  }
}

type NavRoute = { fullPath: string; options: { staticData?: { nav?: NavEntry } } };

const NavMain = () => {
  const router = useRouter();
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = Object.values(
    (router as unknown as { routesById: Record<string, NavRoute> }).routesById,
  );

  const items = routes
    .flatMap((route) => {
      const nav = route.options.staticData?.nav;
      return nav ? [{ ...nav, url: route.fullPath }] : [];
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.label}>
                <Link to={item.url as never}>
                  <item.icon />
                  <span>{item.label}</span>
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
