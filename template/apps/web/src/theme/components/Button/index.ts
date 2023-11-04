import { Button } from '@mantine/core';

import classes from './index.module.css';

export default Button.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: {
    label: classes.label,
  },
});
