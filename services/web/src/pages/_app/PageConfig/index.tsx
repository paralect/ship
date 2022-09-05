import { FC, Fragment, ReactElement } from 'react';
import { useRouter } from 'next/router';

import * as routes from 'routes';
import { Global } from '@mantine/core';
import { userApi } from 'resources/user';

import 'resources/user/user.handlers';
import { globalStyles } from 'theme/globalStyles';

import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';

const configurations = Object.values(routes.configuration);

const layoutToComponent = {
  [routes.layout.MAIN]: MainLayout,
  [routes.layout.UNAUTHORIZED]: UnauthorizedLayout,
  [routes.layout.NONE]: Fragment,
};

const scopeToComponent = {
  [routes.scope.PRIVATE]: PrivateScope,
  [routes.scope.PUBLIC]: Fragment,
  [routes.scope.NONE]: Fragment,
};

interface PageConfigProps {
  children: ReactElement;
}

const PageConfig: FC<PageConfigProps> = ({ children }) => {
  const router = useRouter();
  const { data: currentUser, isLoading: isCurrentUserLoading } = userApi.useGetCurrent();

  if (isCurrentUserLoading) return null;

  const page = configurations.find((r) => r.path === router.route);
  const Layout = layoutToComponent[page?.layout || routes.layout.NONE];
  const Scope = scopeToComponent[page?.scope || routes.scope.NONE];

  if (page?.scope === routes.scope.PRIVATE && !currentUser) {
    router.push(routes.path.signIn);
    return null;
  }

  if (page?.scope === routes.scope.PUBLIC && currentUser) {
    router.push(routes.path.home);
    return null;
  }

  return (
    <Scope>
      <>
        <Global styles={globalStyles} />
        <Layout>
          {children}
        </Layout>
      </>
    </Scope>
  );
};

export default PageConfig;
