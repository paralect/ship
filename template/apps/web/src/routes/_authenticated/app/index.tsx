import { createFileRoute } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks';

export const Route = createFileRoute('/_authenticated/app/')({
  component: Dashboard,
});

function Dashboard() {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-4xl">
          Welcome back{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}!
        </h1>

        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          This is your dashboard. Start building something great!
        </p>
      </div>
    </div>
  );
}
