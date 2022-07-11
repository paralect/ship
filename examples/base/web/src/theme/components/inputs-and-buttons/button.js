export const Button = ({
  colors,
  radius,
  other: {
    transition: { speed, easing },
  },
}) => ({
  root: {
    boxSizing: 'border-box',
    borderRadius: radius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    transition: `opacity ${speed.fast} ${easing.easeInOut}`,
    height: '48px',
    padding: '8px 22px',

    '&:hover': {
      opacity: '0.7',
    }
  },
  filled: {
    backgroundColor: colors.brand[9],
  },
  outline: {
    borderColor: colors.brand[1],
    color: colors.brand[9],
  },
  subtle: {
    border: 'none',
    background: 'none',
    color: colors.blue[5],

    '&:hover': {
      color: colors.blue[6],
      background: 'none',
    },
  },
  loading: {
    textIndent: '-9999px',
  },
});