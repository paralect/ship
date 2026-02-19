import Head from 'next/head';
import Link from 'next/link';
import { useApiQuery } from 'hooks/use-api.hook';
import { MessageSquare } from 'lucide-react';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';

import { Button } from '@/components/ui/button';

const Home = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back{account?.firstName ? `, ${account.firstName}` : ''}!
          </h1>

          <p className="mt-4 text-lg text-gray-600">Ready to start a conversation? Head over to the chat.</p>

          <Button asChild className="mt-6">
            <Link href={RoutePath.ChatIndex}>
              <MessageSquare className="mr-2 size-4" />
              Go to Chat
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
