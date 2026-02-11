import { NextPage } from 'next';
import Head from 'next/head';

import { accountApi } from 'resources/account';

const Home: NextPage = () => {
  const { data: account } = accountApi.useGet();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Welcome, {account?.firstName}!</h1>

        <p className="text-muted-foreground">This is your Ship application powered by shadcn/ui.</p>
      </div>
    </>
  );
};

export default Home;
