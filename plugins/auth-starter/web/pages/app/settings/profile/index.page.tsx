import { useCurrentUser } from 'hooks';

import SettingsLayout from '../components/SettingsLayout';
import ProfileTab from '../components/ProfileTab';

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
