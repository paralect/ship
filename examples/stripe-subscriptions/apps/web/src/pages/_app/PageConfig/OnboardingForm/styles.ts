import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors, primaryColor, white }) => ({
  wrapper: {
    minWidth: '830px',
    maxWidth: '830px',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  container: {
    height: '100vh',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  logoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'end',
    padding: '0 0 32px 40px',
    backgroundColor: colors.gray[0],
    backgroundImage: 'url(/images/ship-flight.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
  },
  stepper: {
    '.mantine-Stepper-steps': {
      gap: '8px',
      justifyContent: 'center',
    },
    '.mantine-Stepper-separator, .mantine-Stepper-stepIcon': {
      display: 'none',
    },
    '.mantine-Stepper-step': {
      '& .mantine-Stepper-stepWrapper': {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: colors.gray[4],
      },
      '&[data-progress], &[data-completed]': {
        '& .mantine-Stepper-stepWrapper': {
          backgroundColor: colors[primaryColor][6],
        },
      },
    },
  },
}));
