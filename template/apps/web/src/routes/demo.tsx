import { createFileRoute, Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { getGreeting } from '@/server/greeting';

export const Route = createFileRoute('/demo')({
  loader: () => getGreeting(),
  component: Demo,
});

function Demo() {
  const { message } = Route.useLoaderData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="font-mono text-xs font-black uppercase tracking-widest text-muted-foreground">
        API as a function
      </p>
      <h1 className="max-w-xl text-3xl font-bold sm:text-4xl">{message}</h1>
      <p className="max-w-md text-muted-foreground">
        This came from a TanStack Start server function in{' '}
        <code className="rounded bg-muted px-1.5 py-0.5">src/server/greeting.ts</code>, called from
        this route&rsquo;s loader. No separate API needed.
      </p>
      <Button asChild variant="ghost">
        <Link to="/">← Back to landing</Link>
      </Button>
    </main>
  );
}
