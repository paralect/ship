import { createStyles } from '@mantine/core';

const BROWSE_BTN_SIZE = '88px';

export const useStyles = createStyles(({
  colors,
  white,
  primaryColor,
  other: {
    transition: { speed, easing },
  },
}, _params, getRef) => ({
  browseButton: {
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    borderRadius: '50%',
    backgroundColor: white,
    border: `1px dashed ${colors[primaryColor][6]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${speed.fast} ${easing.easeInOut}`,
    cursor: 'pointer',

    '&:hover': {
      [`& .${getRef('addIcon')}`]: {
        color: colors.gray[5],
      },
    },
  },
  error: {
    border: `1px dashed ${colors.red[5]}`,
  },
  addIcon: {
    ref: getRef('addIcon'),
    color: colors[primaryColor][6],
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
    color: colors.gray[2],
    opacity: 0,
    transition: `all ${speed.smooth} ${easing.easeInOut}`,
  },
  text: {
    width: '144px',
    lineHeight: '24px',
    color: colors.gray[6],
    wordWrap: 'break-word',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
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
