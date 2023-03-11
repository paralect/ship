import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  chip: {
    label: {
      height: '50px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      borderRadius: '4px',

      '&[data-checked]': {
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      '& span': {
        marginLeft: 'auto',
      },
    },
    input: {
      display: 'none',
    },
  },
  chipGroup: {
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'stretch',
  },
}));
