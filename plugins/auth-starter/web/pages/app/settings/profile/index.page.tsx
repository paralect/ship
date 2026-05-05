import { useCurrentUser } from 'hooks';

import SettingsLayout from '../components/settings-layout';
import ProfileTab from '../components/profile-tab';

const ProfileSettings = () => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return null;

  return (
    <SettingsLayout title="Profile">
      <ProfileTab currentUser={currentUser} />
    </SettingsLayout>
  );
};

export default ProfileSettings;
