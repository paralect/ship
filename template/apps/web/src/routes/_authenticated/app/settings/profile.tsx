import { createFileRoute } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks';

import SettingsLayout from '../-components/settings/settings-layout';
import ProfileTab from '../-components/settings/profile-tab';

export const Route = createFileRoute('/_authenticated/app/settings/profile')({
  component: ProfileSettings,
});

function ProfileSettings() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return null;

  return (
    <SettingsLayout title="Profile">
      <ProfileTab currentUser={currentUser} />
    </SettingsLayout>
  );
}
