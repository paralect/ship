'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { accountApi } from 'resources/account';

import { analyticsService } from 'services';

import { RoutePath, routesConfiguration, ScopeType } from 'routes';
import config from 'config';

// import MainLayout from '../old-pages/_app/PageConfig/MainLayout';
import PrivateScope from '../old-pages/_app/PageConfig/PrivateScope';

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

const PageConfig = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: account, isLoading: isAccountLoading, dataUpdatedAt } = accountApi.useGet();

  useEffect(() => {
    if (!dataUpdatedAt || !config.MIXPANEL_API_KEY) return;
    analyticsService.init();
    analyticsService.setUser(account);
  }, [dataUpdatedAt]);

  if (isAccountLoading) return null;

  const { scope } = routesConfiguration[(pathname as RoutePath) || RoutePath.NotFound] || {};
  const Scope = scope ? scopeToComponent[scope] : Fragment;

  if (scope === ScopeType.PRIVATE && !account) {
    router.push(RoutePath.SignIn);
    return null;
  }

  if (scope === ScopeType.PUBLIC && account) {
    router.push(RoutePath.Home);
    return null;
  }

  return <Scope>{children}</Scope>;
};

export default PageConfig;
