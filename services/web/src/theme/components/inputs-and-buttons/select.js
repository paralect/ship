import { getInputStyles } from "theme/helpers";

export const Select = (theme) => ({
  dropdown: {
    padding: '6px 0',
  },
  item: {
    borderRadius: 0,
    position: 'relative',
  },
  selected: {
    '&::after, &::before': {
      content: '""',
      position: 'absolute',
      width: '1px',
      backgroundColor: theme.colors.brand[9],
    },
    '&::after': {
      height: 6,
      right: 21,
      top: 16,
      transform: 'rotate(-45deg)',
    },
    '&::before': {
      height: 9,
      top: 14,
      transform: 'rotate(45deg)',
      right: 16,
    },
  },
  hovered: {
    backgroundColor: theme.colors.brand[0],
  },
  ...getInputStyles(theme),
});
