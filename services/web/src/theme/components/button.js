export const Button = (theme) => ({
  root: {
    boxSizing: 'border-box',
    border: 0,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    outline: 'none',
    transition: 'opacity 200ms ease-in-out',

    '&:hover': {
      opacity: '0.7',
    }
  },
  filled: {
    backgroundColor: theme.colors.brand[9],
  },
});