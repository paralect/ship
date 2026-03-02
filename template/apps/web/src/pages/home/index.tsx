import Head from 'next/head';
import Link from 'next/link';
import { useApiQuery } from 'hooks/use-api.hook';
import { MessageSquare } from 'lucide-react';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';

import { Button } from '@/components/ui/button';

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
            Ready to start a conversation? Head over to the chat.
          </p>

          <Button asChild className="mt-6">
            <Link href="/chat">
              <MessageSquare className="mr-2 size-4" />
              Go to Chat
            </Link>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Home;
