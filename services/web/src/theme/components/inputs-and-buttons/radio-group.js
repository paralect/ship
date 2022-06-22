export const RadioGroup = (theme) => ({
  radioWrapper: {
    label: {
      cursor: 'pointer',
      paddingLeft: '8px',
      margin: 0,
    },
    '&:hover': {
      input: {
        borderColor: theme.colors.brand[9],
        '&:checked': {
          borderColor: theme.colors.brand[7],
        },
      },
      svg: {
        color: theme.colors.brand[7],
      },
    },
  },
  radio: {
    cursor: 'pointer',
    borderColor: theme.colors.brand[2],
    transition: 'all 200ms ease-in-out',
    '&:checked': {
      background: theme.white,
    },
  },
  icon: {
    color: theme.colors.brand[9],
    transition: 'all 200ms ease-in-out',
  },
});
