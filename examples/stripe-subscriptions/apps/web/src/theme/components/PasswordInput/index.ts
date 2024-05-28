import { PasswordInput } from '@mantine/core';
import cx from 'clsx';

import classes from './index.module.css';

export default PasswordInput.extend({
  defaultProps: {
    size: 'md',
  },
  classNames: (_, props) => ({
    label: cx({
      [classes.error]: props.error,
    }),
  }),
});
