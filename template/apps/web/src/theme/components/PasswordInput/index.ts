import { PasswordInput } from '@mantine/core';

export default PasswordInput.extend({
  defaultProps: {
    size: 'lg',
    styles: {
      innerInput: {
        fontSize: '16px !important',

        // '&::placeholder': {
        //   color: '#6d747b',
        // },
      },
      label: {
        fontSize: 18,
        fontWeight: 600,
      },
      // invalid: {
      //   input: {
      //     '&::placeholder': {
      //       color: theme.colors.red[6],
      //     },
      //   },
      // },
    },
  },
});
