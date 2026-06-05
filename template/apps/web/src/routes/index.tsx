import { createFileRoute } from '@tanstack/react-router';

import Landing from '@/components/landings/dark';

export const Route = createFileRoute('/')({
  component: Landing,
});
