import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.colors.gray[1]}`,
    fontSize: '14px',
  },
}));
