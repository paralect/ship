import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import queryClient from '@/query-client';
import { apiClient, ORPC_PATH } from '@/services/api-client.service';
import MainLayout from '@/layouts/main-layout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = (apiClient.users.getCurrent as any)[ORPC_PATH] as string[];
    const user = queryClient.getQueryData(key);

    if (!user) {
      try {
        await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => (apiClient.users.getCurrent as unknown as () => Promise<unknown>)(),
        });
      } catch {
        throw redirect({ to: '/sign-in' });
      }
    }
  },
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});
