export const Table = (theme) => ({
  root: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      border: `1px solid ${theme.colors.brand[2]}`,
      borderRadius: theme.radius.sm,
    },
    '& tbody tr td, & thead tr th': {
      borderBottom: `1px solid ${theme.colors.brand[2]}`,
      backgroundColor: theme.white,
    },
    '& thead tr th': {
      color: theme.colors.brand[5],
      fontWeight: 500,
    },
  },
});
