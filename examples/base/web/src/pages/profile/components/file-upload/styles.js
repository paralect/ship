import { createStyles } from '@mantine/core';

const BROWSE_BTN_SIZE = '88px';

export const useStyles = createStyles(({
  colors,
  white,
  other: {
    transition: { speed, easing },
  },
}, _params, getRef) => ({
  browseButton: {
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    borderRadius: '50%',
    backgroundColor: white,
    border: `1px dashed ${colors.brand[5]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${speed.smooth} ${easing.easeInOut}`,
    cursor: 'pointer',

    '&:hover': {
      [`& .${getRef('addIcon')}`]: {
        color: colors.brand[5],
      },
    },
  },
  error: {
    border: `1px dashed ${colors.red[5]}`,
  },
  addIcon: {
    ref: getRef('addIcon'),
    color: colors.brand[2],
    transition: `all ${speed.fast} ${easing.easeInOut}`,
  },
  innerAvatar: {
    ref: getRef('innerAvatar'),
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    borderRadius: '50%',
    background: '#10101099',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.brand[2],
    opacity: 0,
    transition: `all ${speed.smooth} ${easing.easeInOut}`,
  },
  text: {
    width: '144px',
    marginLeft: '24px',
    lineHeight: '24px',
    color: colors.brand[5],
    wordWrap: 'break-word',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: '32px',
  },
  errorMessage: {
    marginTop: '4px',
    fontSize: '14px',
    lineHeight: '17px',
    color: colors.red[5],
  },
  avatar: {
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '50%',
    '&:hover': {
      borderColor: '#10101099',
    },
    [`&:hover .${getRef('innerAvatar')}`]: {
      opacity: 1,
    },
  },
}));
