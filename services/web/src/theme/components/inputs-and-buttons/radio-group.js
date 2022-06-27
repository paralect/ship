export const RadioGroup = ({
  colors,
  white,
  other: {
    transition: { speed, easing },
  },
}) => ({
  radioWrapper: {
    label: {
      cursor: 'pointer',
      paddingLeft: '8px',
      margin: 0,
    },
    '&:hover': {
      input: {
        borderColor: colors.brand[9],
        '&:checked': {
          borderColor: colors.brand[7],
        },
      },
      ['icon']: {
        color: colors.brand[7],
      },
    },
  },
  radio: {
    cursor: 'pointer',
    borderColor: colors.brand[2],
    transition: `all ${speed.fast} ${easing.easeInOut}`,
    '&:checked': {
      background: white,
    },
  },
  icon: {
    color: colors.brand[9],
    transition: `all ${speed.smooth} ${easing.easeInBack}`,
  },
});
