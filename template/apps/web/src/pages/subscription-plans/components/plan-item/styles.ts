import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  card: {
    flex: '1 1',
    borderColor: theme.colors.gray[4],
  },
  active: {
    border: 'none',
    background: theme.colors.gray[1],
  },
  icon: {
    color: theme.colors.blue[6],
  },
  activeText: {
    height: '42px',
    fontWeight: 500,
    color: theme.colors.green[9],
  },
  activeIcon: {
    marginRight: '4px',
    padding: '2px',
    backgroundColor: theme.colors.green[9],
    borderRadius: '50%',
    color: theme.white,
  },
}));
