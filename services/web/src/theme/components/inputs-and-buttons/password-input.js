import { getInputStyles } from "theme/helpers";

export const PasswordInput = (theme) => ({
  root: {
    color: theme.colors.brand[9],
    '&:focus-within': {
      color: theme.colors.blue[5],
    },
  },
  visibilityToggle: {
    '&:hover': {
      background: 'none',
    },
  },
  innerInput: {
    height: '100%',
  },
  ...getInputStyles(theme),
});
