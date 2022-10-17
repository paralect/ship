import { FC, Fragment, ReactElement } from 'react';
import { useRouter } from 'next/router';

import { routesConfiguration, ScopeType, LayoutType, RoutePath } from 'routes';
import { accountApi } from 'resources/account';

import 'resources/user/user.handlers';

import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';

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
  const { data: account, isLoading: isAccountLoading } = accountApi.useGet();

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
      <Layout>
        {children}
      </Layout>
    </Scope>
  );
};

export default PageConfig;
