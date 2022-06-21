export const Button = (theme) => ({
  root: {
    boxSizing: 'border-box',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    transition: 'opacity 200ms ease-in-out',
    height: '48px',
    padding: '8px 22px',

    '&:hover': {
      opacity: '0.7',
    }
  },
  outline: {
    borderColor: theme.colors.brand[1],
    color: theme.colors.brand[9],
  },
  subtle: {
    border: 'none',
    background: 'none',
    color: theme.colors.blue[5],

    '&:hover': {
      color: theme.colors.blue[6],
      background: 'none',
    },
  },
  loading: {
    textIndent: '-9999px',
  },
});