export const Switch = (theme) => ({
  root: {
    '&:hover': {
      input: {
        borderColor: theme.colors.brand[9],
        '&:checked': {
          backgroundColor: theme.colors.brand[7],
          borderColor: theme.colors.brand[7],
        },
      },
    },
  },
  input: {
    cursor: 'pointer',
    borderColor: theme.colors.brand[2],
    background: 'none',
    '&::before': {
      backgroundColor: theme.colors.brand[7],
      borderColor: theme.colors.brand[7],
    },
    '&:checked::before': {
      backgroundColor: theme.white,
      borderColor: theme.white,
    },
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '8px',
  },
});
