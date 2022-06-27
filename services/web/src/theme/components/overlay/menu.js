export const Menu = ({
  colors,
  radius,
  other: {
    transition: { speed, easing },
  },
}) => ({
  body: {
    padding: '6px 0',
    border: `1px solid ${colors.brand[2]}`,
    borderRadius: radius.sm,
  },
  item: {
    height: '40px',
    width: '100%',
    padding: '4px 14px',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '19px',
    color: colors.brand[9],
    cursor: 'pointer',
    borderRadius: 0,
    transition: `background-color ${speed.fast} ${easing.ease}`,
  },
  itemHovered: {
    backgroundColor: `${colors.brand[0]} !important`,
  },
});