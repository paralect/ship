import { getInputStyles } from "theme/helpers";

export const ColorInput = (theme) => ({
  root: {
    color: theme.colors.brand[9],
    '&:focus-within': {
      color: theme.colors.blue[5],
    },
  },
  ...getInputStyles(theme),
});
