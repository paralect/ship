export const globalStyles = (theme) => ({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  body: {
    ...theme.fn.fontStyles(),
  },
});
