import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';

const NotFound: NextPage = () => {
  const { replace } = useRouter();

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>

      <div className="m-auto flex h-screen w-[328px] flex-col justify-center">
        <h2 className="text-2xl font-semibold">Oops! The page is not found.</h2>

        <p className="mx-0 mt-5 mb-6 text-muted-foreground">
          The page you are looking for may have been removed, or the link you followed may be broken.
        </p>

        <Button onClick={() => replace('/')}>Go to homepage</Button>
      </div>
    </>
  );
};

export default NotFound;
