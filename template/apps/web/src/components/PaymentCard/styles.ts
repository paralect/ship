import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  form: {
    maxWidth: '400px',
  },
  buttons: {
    marginTop: '16px',
  },
  button: {
    color: theme.colors.blue[6],
    borderColor: theme.colors.blue[6],
  },
}));
