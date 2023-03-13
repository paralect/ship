import { createStyles, getStylesRef } from '@mantine/core';

const BROWSE_BTN_SIZE = '88px';

export const useStyles = createStyles(({
  colors,
  primaryColor,
  other: {
    transition: { speed, easing },
  },
}) => ({
  dropzoneRoot: {
    border: 'none',
    borderRadius: 0,
    padding: 0,
    backgroundColor: 'transparent',

    [`&:hover .${getStylesRef('addIcon')}`]: {
      color: colors.gray[5],
    },

    [`&:hover .${getStylesRef('browseButton')}`]: {
      border: `1px dashed ${colors.gray[5]}`,
    },

    [`&:hover .${getStylesRef('innerAvatar')}`]: {
      opacity: 1,
    },
  },
  browseButton: {
    ref: getStylesRef('browseButton'),
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    borderRadius: '50%',
    border: `1px dashed ${colors[primaryColor][6]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${speed.fast} ${easing.easeInOut}`,
    cursor: 'pointer',
  },
  error: {
    border: `1px dashed ${colors.red[5]}`,
  },
  addIcon: {
    ref: getStylesRef('addIcon'),
    color: colors[primaryColor][6],
    transition: `all ${speed.fast} ${easing.easeInOut}`,
  },
  innerAvatar: {
    ref: getStylesRef('innerAvatar'),
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
  },
}));
