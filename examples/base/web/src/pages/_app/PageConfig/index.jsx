import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import * as routes from 'routes';
import { userApi } from 'resources/user';

import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';

import 'resources/user/user.handlers';

const configurations = Object.values(routes.configuration);

const layoutToComponent = {
  [routes.layout.MAIN]: MainLayout,
  [routes.layout.UNAUTHORIZED]: UnauthorizedLayout,
  [routes.layout.NONE]: ({ children }) => children,
};

const scopeToComponent = {
  [routes.scope.PRIVATE]: PrivateScope,
  [routes.scope.PUBLIC]: ({ children }) => children,
  [routes.scope.NONE]: ({ children }) => children,
};

const PageConfig = ({ children }) => {
  const router = useRouter();
  const { data: currentUser, isLoading: isCurrentUserLoading } = userApi.useGetCurrent();

  if (isCurrentUserLoading) return null;

  const page = configurations.find((r) => r.path === router.route);
  const Layout = layoutToComponent[page.layout];
  const Scope = scopeToComponent[page.scope];

  if (page.scope === routes.scope.PRIVATE && !currentUser) {
    router.push(routes.path.signIn);
    return null;
  }

  if (page.scope === routes.scope.PUBLIC && currentUser) {
    router.push(routes.path.home);
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

PageConfig.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageConfig;
