export const Menu = (theme) => ({
  body: {
    padding: '6px 0',
    border: `1px solid ${theme.colors.gray[1]}`,
    borderRadius: '6px',
  },
  item: {
    height: '40px',
    width: '100%',
    padding: '4px 14px',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '19px',
    color: theme.colors.brand[9],
    cursor: 'pointer',
    borderRadius: 0,
    transition: 'background-color 200ms linear',
  },
  itemHovered: {
    backgroundColor: `${theme.colors.brand[0]} !important`,
  },
});