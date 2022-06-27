import { getInputStyles } from "theme/helpers";

export const Textarea = (theme) => ({
  root: {
    color: theme.colors.brand[9],
    '&:focus-within': {
      color: theme.colors.blue[5],
    },
  },
  description: {
    color: `${theme.colors.brand[4]} !important`,
  },
  filledVariant: {
    backgroundColor: theme.colors.brand[0]
  },
  ...getInputStyles(theme),
});
