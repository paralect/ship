import { Button } from '@mantine/core';

export default Button.extend({
  defaultProps: {
    size: 'lg',
  },
  styles: {
    label: {
      fontWeight: 500,
    },
  },
});
