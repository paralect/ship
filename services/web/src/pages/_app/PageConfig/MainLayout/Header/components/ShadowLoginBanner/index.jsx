import { Paper } from '@mantine/core';

const ShadowLoginBanner = () => (
  <Paper
    shadow="md"
    sx={(theme) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '32px',
      fontWeight: 'bold',
      color: theme.colors.red[6],
    })}
  >
    Shadow login mode
  </Paper>
);

export default ShadowLoginBanner;
