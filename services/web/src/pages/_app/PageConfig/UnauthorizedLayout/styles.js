import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  wrapper: {
    height: '100vh',
    padding: '0 32px',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    minHeight: '72px',
    display: 'flex',
    alignItems: 'center',
  },
}));
