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
    borderRadius: theme.radius.xs,
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '8px',
  },
});
