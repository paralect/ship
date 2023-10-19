import { PasswordInput } from '@mantine/core';

import classes from './PasswordInput.module.css';

export default PasswordInput.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: {
    innerInput: classes.innerInput,
    label: classes.label,
  },
});
