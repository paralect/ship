import { getInputStyles } from "theme/helpers";

export const MultiSelect = (theme) => {
  const { input, ...restStyles } = getInputStyles(theme);

  return {
    input: {
      ...input,
      height: 'auto',
      padding: '0 16px',
    },
    values: {
      minHeight: 38,
    },
    value: {
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.brand[0],
      color: theme.colors.brand[9],
    },
    ...restStyles,
  }
};
