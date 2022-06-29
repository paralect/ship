export const getInputStyles = ({
  colors,
  radius,
  other: {
    transition: { speed, easing },
  },
}) => ({
  rightSection: {
    '& svg': {
      transition: `transform ${speed.fast} ${easing.easeInOut}`,
    },
  },
  input: {
    height: '40px',
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${colors.brand[2]}`,
    borderRadius: radius.sm,
    lineHeight: '14px',
  
    '&:hover:not(:focus):not(:focus-within):not(:disabled):not([aria-invalid])': {
      borderColor: colors.brand[5],
    },
  
    '&:focus, &:focus-within': {
      borderColor: colors.blue[5],
      '& + div[class*="rightSection"] svg': {
        transform: 'rotate(180deg)',
      },
    },
    '&:disabled': {
      backgroundColor: colors.brand[0],
    },
  },
  label: {
    color: 'inherit',
    transition: `color ${speed.fast} ${easing.easeInOut}`,
    '&[data-invalid="true"]': {
      color: colors.red[5],
    },
  },
  invalid: {
    '&, &:focus, &:focus-within, &:hover': {
      color: colors.red[5],
      borderColor: colors.red[5],
      '&::placeholder': {
        color: colors.red[5],
      },
    },
  },
  error: {
    color: colors.red[5],
  },
});
