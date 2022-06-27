
export const SegmentedControl = ({ colors }) => ({
  root: {
    padding: '3px',
    border: `1px solid ${colors.brand[2]}`,
    backgroundColor: 'transparent',
  },
  control: {
    borderRadius: '4px !important',
    '&:not(:first-of-type)': {
      border: 'none',
    }
  },
  label: {
    fontWeight: '400',
    padding: '8.5px 16px',
    color: colors.brand[9],
  },
  controlActive: {
    backgroundColor: colors.brand[9],
  },
  labelActive: {
    color: 'white !important',
  },
});
