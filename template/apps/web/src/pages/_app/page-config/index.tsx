import 'services/socket-handlers';

import { FC, Fragment, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'hooks';

import { analyticsService } from 'services';

import config from 'config';

import MainLayout from './main-layout';
import PrivateScope from './private-scope';
import PublicLayout from './public-layout';
import { LayoutType, ScopeType } from './types';
import UnauthorizedLayout from './unauthorized-layout';

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

  const { data: currentUser, isLoading: isCurrentUserLoading, dataUpdatedAt } = useCurrentUser();

  useEffect(() => {
    if (!dataUpdatedAt || !config.MIXPANEL_API_KEY) return;

    analyticsService.init();
    analyticsService.setUser(currentUser);
  }, [dataUpdatedAt]);

  if (isCurrentUserLoading) return null;

  const Scope = scope ? scopeToComponent[scope] : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  if (scope === ScopeType.PRIVATE && !currentUser) {
    push('/sign-in');
    return null;
  }

  if (scope === ScopeType.PUBLIC && currentUser) {
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
