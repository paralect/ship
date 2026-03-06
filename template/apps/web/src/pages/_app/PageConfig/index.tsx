import 'services/socket-handlers';

import { FC, Fragment, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApiQuery } from 'hooks/use-api.hook';

import { analyticsService } from 'services';
import { apiClient } from 'services/api-client.service';

import config from 'config';

import MainLayout from './MainLayout';
import PrivateScope from './PrivateScope';
import PublicLayout from './PublicLayout';
import { LayoutType, ScopeType } from './types';
import UnauthorizedLayout from './UnauthorizedLayout';

const layoutToComponent = {
  [LayoutType.MAIN]: MainLayout,
  [LayoutType.UNAUTHORIZED]: UnauthorizedLayout,
  [LayoutType.PUBLIC_PAGE]: PublicLayout,
};

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

interface PageConfigProps {
  children: ReactNode;
  scope?: ScopeType;
  layout?: LayoutType;
}

const Page: FC<PageConfigProps> = ({ children, scope, layout }) => {
  const { push } = useRouter();

  const { data: account, isLoading: isAccountLoading, dataUpdatedAt } = useApiQuery(apiClient.account.get);

  useEffect(() => {
    if (!dataUpdatedAt || !config.MIXPANEL_API_KEY) return;

    analyticsService.init();
    analyticsService.setUser(account);
  }, [dataUpdatedAt]);

  if (isAccountLoading) return null;

  const Scope = scope ? scopeToComponent[scope] : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  if (scope === ScopeType.PRIVATE && !account) {
    push('/sign-in');
    return null;
  }

  if (scope === ScopeType.PUBLIC && account) {
    push('/');
    return null;
  }

  return (
    <Scope>
      <Layout>{children}</Layout>
    </Scope>
  );
};

export default Page;
