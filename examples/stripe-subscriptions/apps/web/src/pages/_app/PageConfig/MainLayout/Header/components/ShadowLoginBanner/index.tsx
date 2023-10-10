import { Paper } from '@mantine/core';

const ShadowLoginBanner = ({ email }: { email: string }) => (
  <Paper
    shadow="md"
    sx={(theme) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '32px',
      fontWeight: 600,
      color: theme.white,
      backgroundColor: theme.colors.dark[4],
      borderRadius: 0,
    })}
  >
    You currently under the shadow login as &apos;
    {email}
    &apos;
  </Paper>
);

export default ShadowLoginBanner;
