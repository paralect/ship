import { Button } from '@mantine/core';

import classes from './Button.module.css';

export default Button.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: {
    label: classes.label,
  },
});
