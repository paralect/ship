import { PasswordInput } from '@mantine/core';
import cx from 'clsx';

import classes from './index.module.css';

export default PasswordInput.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: (_, props) => ({
    innerInput: cx(classes.innerInput, {
      [classes.innerInputError]: props.error,
    }),
    label: classes.label,
    input: cx({
      [classes.inputError]: props.error,
    }),
  }),
});
