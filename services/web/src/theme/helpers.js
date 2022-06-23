export const getInputStyles = (theme) => ({
  input: {
    height: '40px',
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${theme.colors.gray[1]}`,
    borderRadius: 6,
  
    '&:hover:not(:focus):not(:focus-within):not(:disabled):not([aria-invalid])': {
      borderColor: theme.colors.gray[5],
    },
  
    '&:focus, &:focus-within': {
      borderColor: theme.colors.blue[5],
    },
    '&:disabled': {
      backgroundColor: theme.colors.brand[0],
    },
  },
  label: {
    color: 'inherit',
    transition: 'color 200ms ease-in-out',
    '&[data-invalid="true"]': {
      color: theme.colors.red[5],
    },
  },
  invalid: {
    '&, &:focus, &:focus-within, &:hover': {
      color: theme.colors.red[5],
      borderColor: theme.colors.red[5],
      '&::placeholder': {
        color: theme.colors.red[5],
      },
    },
  },
  error: {
    color: theme.colors.red[5],
  },
});
