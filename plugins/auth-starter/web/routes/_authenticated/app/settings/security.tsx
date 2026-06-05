import { createFileRoute } from '@tanstack/react-router';

import SettingsLayout from '../-components/settings/settings-layout';
import SecurityTab from '../-components/settings/security-tab';

export const Route = createFileRoute('/_authenticated/app/settings/security')({
  component: SecuritySettings,
});

function SecuritySettings() {
  return (
    <SettingsLayout title="Security">
      <SecurityTab />
    </SettingsLayout>
  );
}
