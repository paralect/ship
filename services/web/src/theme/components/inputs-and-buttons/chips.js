
export const Chips = ({ colors }) => ({
  label: {
    color: colors.brand[9],
  },
  filled: {
    color: 'white',
    backgroundColor: colors.brand[9],
    '&:hover': {
      backgroundColor: colors.brand[5],
    }    
  },
  outline: {
    '&:hover': {
      backgroundColor: colors.brand[1],
    }
  },
  disabled: {
    backgroundColor: `${colors.brand[0]} !important`,    
    borderColor: `${colors.brand[0]} !important`,
    color: `${colors.brand[5]} !important`
  },
  checked: {
    color: `${colors.brand[9]} !important`,
  }
});
