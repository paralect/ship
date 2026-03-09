import Head from 'next/head';
import { useApiQuery } from 'hooks/use-api.hook';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';

const Dashboard = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-4xl">
            Welcome back{account?.firstName ? `, ${account.firstName}` : ''}!
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            This is your dashboard. Start building something great!
          </p>
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
