export const Checkbox = (theme) => ({
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
    borderRadius: '4px',
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '8px',
  },
});
