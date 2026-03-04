import Head from 'next/head';
import { useApiQuery } from 'hooks/use-api.hook';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';

const Home = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Home</title>
      </Head>

      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-4xl">
            Welcome back{account?.firstName ? `, ${account.firstName}` : ''}!
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            This is your dashboard. Explore the features available in the sidebar.
          </p>
        </div>
      </div>
    </Page>
  );
};

export default Home;
