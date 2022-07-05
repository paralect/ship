import { getInputStyles } from "theme/helpers";

export const Autocomplete = (theme) => ({
  root: {
    color: theme.colors.brand[9],
    '&:focus-within': {
      color: theme.colors.blue[5],
    },
  },
  hovered: { 
    backgroundColor: theme.colors.brand[0]
  },
  ...getInputStyles(theme),
});
