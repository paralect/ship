import { TextInput } from '@mantine/core';

export default TextInput.extend({
  defaultProps: {
    size: 'lg',
  },
  styles: {
    input: {
      fontSize: 16,

      // '&::placeholder, &:disabled, &:disabled::placeholder': {
      //   color: '#6d747b !important',
      // },
    },
    // invalid: {
    //   color: theme.colors.gray[9],

    //             '&, &:focus-within': {
    //               borderColor: theme.colors.red[6],
    //             },
    // },
    label: {
      fontSize: 18,
      fontWeight: 600,
    },
  },
});
