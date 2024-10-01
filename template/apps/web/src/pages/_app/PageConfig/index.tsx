import React, { FC, Fragment, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';

import { accountApi } from 'resources/account';

import { analyticsService } from 'services';

import { LayoutType, RoutePath, routesConfiguration, ScopeType } from 'routes';
import config from 'config';

import MainLayout from './MainLayout';
import PrivateScope from './PrivateScope';
import UnauthorizedLayout from './UnauthorizedLayout';

import 'resources/user/user.handlers';

const layoutToComponent = {
  [LayoutType.MAIN]: MainLayout,
  [LayoutType.UNAUTHORIZED]: UnauthorizedLayout,
};

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

interface PageConfigProps {
  children: ReactElement;
}

const PageConfig: FC<PageConfigProps> = ({ children }) => {
  const { route, push } = useRouter();

  const { data: account, isLoading: isAccountLoading, isSuccess, isError } = accountApi.useGet();

  useEffect(() => {
    if ((!isSuccess && !isError) || !config.MIXPANEL_API_KEY) return;

    analyticsService.init();
    analyticsService.setUser(account);
  }, [isSuccess, isError]);

  if (isAccountLoading) return null;

  const { scope, layout } = routesConfiguration[route as RoutePath] || {};
  const Scope = scope ? scopeToComponent[scope] : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  if (scope === ScopeType.PRIVATE && !account) {
    push(RoutePath.SignIn);
    return null;
  }

  if (scope === ScopeType.PUBLIC && account) {
    push(RoutePath.Home);
    return null;
  }

  return (
    <Scope>
      <Layout>{children}</Layout>
    </Scope>
  );
};

export default PageConfig;
